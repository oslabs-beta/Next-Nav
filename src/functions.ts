import * as fs from 'fs/promises';
import * as path from 'path';
import * as vscode from 'vscode';

//Checks that child directory is within parent directory
function isSubdirectory(parent: string, child: string) {
  const parentPath = path.resolve(parent).toLowerCase();
  const childPath = path.resolve(child).toLowerCase();
  console.log('p: ' + parentPath);
  console.log('c: ' + childPath);
  return parentPath.startsWith(childPath);
}

export async function getValidDirectoryPath(dirPath: string): Promise<string> {
  try {
    if (!vscode.workspace.workspaceFolders) {
      return '';
    }
    const workspaceDir = vscode.workspace.workspaceFolders[0].uri.fsPath;
    // Convert to absolute path if it is a relative path
    const absoluteDirPath = path.isAbsolute(dirPath)
      ? dirPath
      : path.join(workspaceDir, dirPath);
    console.log(absoluteDirPath);

    // Validate if this path is within the workspace directory
    if (!isSubdirectory(absoluteDirPath, workspaceDir)) {
      console.log('workspace: ', workspaceDir);
      console.log('absolute: ', absoluteDirPath);
      console.log('not within working dir');
      return '';
    }
    // Check if the directory actually exists
    const stat = await fs.stat(absoluteDirPath);
    if (!stat.isDirectory()) {
      console.log('doesnt exist');
      return '';
    }
    //logging path to test in windows

    return absoluteDirPath; // Return the validated absolute directory path
  } catch (err: any) {
    return '';
  }
}
