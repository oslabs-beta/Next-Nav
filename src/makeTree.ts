import * as fsPromises from 'fs/promises';
import { Dirent } from 'fs';
import { createInterface } from 'readline';
import { createReadStream } from 'fs';
import * as path from 'path';
import { Directory } from './types';

//function to make the tree
export default async function treeMaker(validDir: string): Promise<Directory[] | {}> {
  let idCounter = 1;

  //directory to be put into the output structure, id of the directory will match its index in the structure
  const structure: Directory[] = [
    {
      id: 0,
      folderName: path.basename(validDir),
      parentNode: null,
      path: validDir,
      contents: [],
      render: 'server'
    }
  ];


  // Function used to parse through file and check if its client side rendered
  async function checkForClientDirective(filePath: string): Promise<boolean> {
    // Create a Readable Stream to read the file
    const rl = createInterface({
      input: createReadStream(filePath, { end: 999 }) // Read up to the first 1000 bytes assuming the client is in there dont want to read whole file
    });

    let firstNonCommentText = '';  // Store the first non-comment line of code
    let inCommentBlock = false;    // Flag for inside a block comment

    // Loop through each line of the file
    for await (const line of rl) {
      // Check if inside a block comment
      if (inCommentBlock) {
        // If end of block comment is found, exit block comment mode
        if (line.includes('*/')) {
          inCommentBlock = false;
        }
        continue;
      }

      // Check for start of a new block comment
      let startCommentIndex = line.indexOf('/*');
      if (startCommentIndex !== -1) {
        inCommentBlock = true; // Enter block comment mode

        // Check if it is a single-line block comment
        let endCommentIndex = line.indexOf('*/');
        if (endCommentIndex !== -1 && endCommentIndex > startCommentIndex) {
          // Exit block comment mode
          inCommentBlock = false;

          // Remove the block comment and check the remaining text if there is a comment and code on the same line
          const modifiedLine = line.slice(0, startCommentIndex) + line.slice(endCommentIndex + 2);
          if (modifiedLine.trim()) {
            firstNonCommentText = modifiedLine.trim();
            break;
          }
          continue;
        }
        continue;
      }

      // Remove single-line comments (//) and check the remaining text in a case where we have code then //comment
      const noSingleLineComment = line.split('//')[0].trim();
      if (noSingleLineComment) {
        firstNonCommentText = noSingleLineComment;
        break;
      }
    }

    // Close the Readable Stream
    rl.close();

    // Log the first non-comment text for debugging
    console.log(`First non-comment text in ${filePath}: ${firstNonCommentText}`);

    // Check if the first non-comment text contains any form of "use client"
    const targetStrings = ['"use client"', "'use client'", '`use client`'];
    return targetStrings.some(target => firstNonCommentText.includes(target));
  }



  // Recursive function to list files and populate structure
  async function listFiles(dir: string, parent: number): Promise<void> {
    const entities = await fsPromises.readdir(dir, { withFileTypes: true });

    for (const entity of entities) {
      const fullPath = path.join(dir, entity.name);

      if (entity.isDirectory()) {
        const directoryData: Directory = {
          id: idCounter++,
          folderName: entity.name,
          parentNode: parent,
          path: fullPath,
          contents: [],
          render: 'server'
        };

        structure.push(directoryData);
        await listFiles(fullPath, directoryData.id);
      } else if (['page.jsx', 'page.tsx'].includes(entity.name)) {
        structure[parent].contents.push(entity.name);

        // Check if this file has the 'use client' directive
        if (await checkForClientDirective(fullPath)) {
          structure[parent].render = 'client';
        }
      }
    }
  }

  try {
    await listFiles(validDir, 0);
    return structure;
  } catch (err) {
    console.error('Error building the tree:', err);
    return {};
  }
}
