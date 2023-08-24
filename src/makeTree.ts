import * as fs from 'fs/promises';
import { Dirent } from 'fs';
import * as path from 'path';
import { findDir } from './functions';
import {Directory} from './types';

//build the tree
export default async function treeMaker(srcDirName: string, appDirName: string): Promise<Directory[] | {}> {
  let idCounter = 1;  // global id counter

  //find directory
  const directory = await findDir(srcDirName, appDirName);
  //we only want files with these endings
  const extensions = /\.(js|jsx|css|ts|tsx)$/;

  // Handle error cases
  if (directory.status=== 'error') {
    console.error('Error in findDir:', directory);
    return {}; // Return the current structure or an appropriate error object
  }

    const structure: Directory[] = [
      {
        id: 0,
        folderName: appDirName,
        parentNode: null,
        path: directory.data as string,
        contents: []
      }
    ];
  //recurse and get files
  async function listFiles(dir: string, parent: number): Promise<void> {
    //we want file types
    const withFileTypes = true;
    const entities = await fs.readdir(dir, { withFileTypes });
    //loop if its directory add object and recurse if its a file add to its parent
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
  //if we have data return the object with directories
  if (directory.data) {
    try {
      await listFiles(directory.data, 0);
      console.log('tree ', JSON.stringify(structure, null, 2));
      return structure;
    } catch (err) {
      console.error('Error building the tree:', err);
      return {};
    }
  } else {
    console.error('Directory data not found');
    return {};
  }
}
