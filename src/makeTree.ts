import * as fs from 'fs/promises';
import { Dirent } from 'fs';
import * as path from 'path';
import { findDir } from './functions';
import Directory from './directory';

export default async function treeMaker(): Promise<any> {
  let idCounter = 1;  // global id counter
  const structure: Directory[] = [
    { id: 0,
    folderName: 'app',
    parentNode: null,
    contents: []
    }
    ];
    
    const directory =  await findDir();
    const extensions = /\.(js|jsx|css|ts|tsx)$/;
 
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
  
  await listFiles(directory, 0);
  console.log('tree ', JSON.stringify(structure, null, 2));
  return structure;
}



