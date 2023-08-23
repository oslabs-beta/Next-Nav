"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findDir = void 0;
const fs = require("fs/promises");
const path = require("path");
const vscode = require("vscode");
//find directory of src and app
async function findDir(srcDirName, appDirName) {
    //if we have a workspace
    if (!!vscode.workspace.workspaceFolders) {
        const workspacePath = vscode.workspace.workspaceFolders[0].uri.fsPath;
        try {
            //read from workspace
            const entries = await fs.readdir(workspacePath, { withFileTypes: true });
            //find src folder in the main directory
            const srcDir = entries.find(entry => entry.isDirectory() && entry.name === srcDirName);
            if (!srcDir) {
                return { status: 'error', message: `No ${srcDirName} directory found.` };
            }
            const srcPath = path.join(workspacePath, srcDirName);
            const srcEntries = await fs.readdir(srcPath, { withFileTypes: true });
            //find app folder in src directory
            const appDir = srcEntries.find(entry => entry.isDirectory() && entry.name === appDirName);
            if (!appDir) {
                return { status: 'error', message: `No ${appDirName} directory found in ${srcDirName}.` };
            }
            const appPath = path.join(srcPath, appDir.name);
            return { status: 'success', data: appPath };
        }
        catch (err) {
            console.log('error');
            return { status: 'error', message: 'Error reading workspace: ' + err.message };
        }
    }
    else {
        return { status: 'error', message: 'No workspace folder opened.' };
    }
}
exports.findDir = findDir;
//# sourceMappingURL=functions.js.map