import * as fs from 'fs/promises';
import * as path from 'path';
import * as vscode from 'vscode';
import {Output} from './types';

//find directory of src and app
export async function findDir(srcDirName: string, appDirName: string): Promise<Output> {
    if (!!vscode.workspace.workspaceFolders) {
        const workspacePath = vscode.workspace.workspaceFolders[0].uri.fsPath;
        try {
            const entries = await fs.readdir(workspacePath, { withFileTypes: true });

            const srcDir = entries.find(entry => entry.isDirectory() && entry.name === srcDirName);
            if (!srcDir) {
                return { status: 'error', message: `No ${srcDirName} directory found.` };
            }

            const srcPath = path.join(workspacePath, srcDirName);
            const srcEntries = await fs.readdir(srcPath, { withFileTypes: true })

            const appDir = srcEntries.find(entry => entry.isDirectory() && entry.name === appDirName);
            if (!appDir) {
                return { status: 'error', message: `No ${appDirName} directory found in ${srcDirName}.` };
            }

            const appPath = path.join(srcPath, appDir.name);
            return { status: 'success', data: appPath };
        } catch (err: any) {
            console.log('error');
            return { status: 'error', message: 'Error reading workspace: ' + err.message };
        }
    } else {
        return { status: 'error', message: 'No workspace folder opened.' };
    }
}
