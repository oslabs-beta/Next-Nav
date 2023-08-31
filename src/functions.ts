import * as fs from 'fs/promises';
import * as path from 'path';
import * as vscode from 'vscode';

export async function getValidDirectoryPath(dirPath: string): Promise<string> {
  try {
    if (!vscode.workspace.workspaceFolders) {

      return '';
    }
    const workspaceDir = vscode.workspace.workspaceFolders[0].uri.fsPath;
    // Convert to absolute path if it is a relative path
    const absoluteDirPath = path.isAbsolute(dirPath) ? dirPath : path.join(workspaceDir, dirPath);
    // Validate if this path is within the workspace directory
    if (!absoluteDirPath.startsWith(workspaceDir)) {
      return '';
    }
    // Check if the directory actually exists
    const stat = await fs.stat(absoluteDirPath);
    if (!stat.isDirectory()) {
      return '';
    }
    return absoluteDirPath;  // Return the validated absolute directory path
  } catch (err: any) {

    return '';
  }
}
