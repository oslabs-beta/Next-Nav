import * as fs from 'fs/promises';
import { Dirent } from 'fs';
import * as path from 'path';
import { findDir } from './functions';
import {Directory} from './types';

//build the tree
export default async function treeMaker(srcDirName: string, appDirName: string): Promise<Directory[] | {}> {
  let idCounter = 1;  // global id counter
  const structure: Directory[] = [
    {
      id: 0,
      folderName: appDirName,
      parentNode: null,
      contents: []
    }
  ];

  const directory = await findDir(srcDirName, appDirName);
  const extensions = /\.(js|jsx|css|ts|tsx)$/;

  // Handle error cases
  if (directory.status=== 'error') {
    console.error('Error in findDir:', directory);
    return {}; // Return the current structure or an appropriate error object
  }

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
          contents: []
        };

        structure.push(directoryData);
        await listFiles(fullPath, directoryData.id);
      } else if (extensions.test(entity.name)) {
        structure[parent].contents.push(entity.name);
      }
    }
  }
  if(directory.data)
  {
    await listFiles(directory.data, 0);
  }
  console.log('tree ', JSON.stringify(structure, null, 2));
  return structure;
}
