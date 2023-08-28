import * as fs from 'fs/promises';
import * as path from 'path';
import * as vscode from 'vscode';

export async function getValidDirectoryPath(dirPath: string): Promise<string> {
  try {
    if (!vscode.workspace.workspaceFolders) {
      console.log('No workspace folders found.');
      return '';
    }

    const workspaceDir = vscode.workspace.workspaceFolders[0].uri.fsPath;
    console.log('Workspace Directory:', workspaceDir);

    // Convert to absolute path if it is a relative path
    const absoluteDirPath = path.isAbsolute(dirPath) ? dirPath : path.join(workspaceDir, dirPath);
    console.log('Absolute Directory Path:', absoluteDirPath);

    // Validate if this path is within the workspace directory
    if (!absoluteDirPath.startsWith(workspaceDir)) {
      console.log('Directory path is not in workspace directory.');
      return '';
    }

    // Check if the directory actually exists
    const stat = await fs.stat(absoluteDirPath);
    if (!stat.isDirectory()) {
      console.log('Not a directory.');
      return '';
    }

    console.log('Directory exists.');
    return absoluteDirPath;  // Return the validated absolute directory path

  } catch (err: any) {
    console.log('Error:', err);
    return '';
  }
}

