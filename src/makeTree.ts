import * as fs from 'fs/promises';
import { Dirent } from 'fs';
import * as path from 'path';
import { Directory } from './types';

export default async function treeMaker(validDir: string): Promise<Directory[] | {}> {
  let idCounter = 1; // global id counter

  const extensions = /\.(js|jsx|css|ts|tsx)$/;

  const structure: Directory[] = [
    {
      id: 0,
      folderName: path.basename(validDir), // Using basename to get the folder name from the path
      parentNode: null,
      path: validDir,
      contents: []
    }
  ];

  // Recursive function to list files
  async function listFiles(dir: string, parent: number): Promise<void> {
    const withFileTypes = true;
    const entities = await fs.readdir(dir, { withFileTypes });

    for (const entity of entities as Dirent[]) {
      const fullPath = path.join(dir, entity.name);

      if (entity.isDirectory()) {
        const directoryData: Directory = {
          id: idCounter++,
          folderName: entity.name,
          parentNode: parent,
          path: fullPath,
          contents: []
        };

        structure.push(directoryData);
        await listFiles(fullPath, directoryData.id);
      } else if (extensions.test(entity.name)) {
        structure[parent].contents.push(entity.name);
      }
    }
  }

  try {
    await listFiles(validDir, 0);
    console.log('tree ', JSON.stringify(structure, null, 2));
    return structure;
  } catch (err) {
    console.error('Error building the tree:', err);
    return {};
  }
}
