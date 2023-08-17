"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findDir = void 0;
const fs = require("fs/promises");
const path = require("path");
const vscode = require("vscode");
/** OLD WAY ***************************************************************/
// export async function listFolders() {
//     // Check if a workspace is opened
//     console.log(JSON.stringify(vscode.workspace.workspaceFolders));
//     if (vscode.workspace.workspaceFolders !== undefined) {
//         // Get the path of the first workspace folder
//         const workspacePath = vscode.workspace.workspaceFolders[0].uri.fsPath;
//         console.log(workspacePath);
//         // Read the contents of the workspace directory
//         const output = await fs.readdir(workspacePath, { withFileTypes: true });
//             const entries = output.filter(entry => entry.name==='src');
//             console.log(entries);
//             return entries;
//     } else {
//         return 'No workspace folder opened.';
//     }
// }
/************************************************************************ */
async function findDir() {
    // Check if a workspace is opened
    //console.log(JSON.stringify(vscode.workspace.workspaceFolders));
    if (vscode.workspace.workspaceFolders !== undefined) {
        // Get the path of the first workspace folder
        const workspacePath = vscode.workspace.workspaceFolders[0].uri.fsPath;
        // console.log(workspacePath);
        try {
            // Read the contents of the workspace directory
            const entries = await fs.readdir(workspacePath, { withFileTypes: true });
            // Check if the 'src' directory exists
            const srcDir = entries.find(entry => entry.isDirectory() && entry.name === 'src');
            if (!srcDir) {
                return 'No src directory found.';
            }
            // Read the contents of the 'src' directory
            const srcPath = path.join(workspacePath, 'src');
            const srcEntries = await fs.readdir(srcPath, { withFileTypes: true });
            // Check if the 'app' directory exists inside the 'src' directory
            const appDir = srcEntries.find(entry => entry.isDirectory() && entry.name === 'app');
            if (!appDir) {
                return 'No app directory found in src.';
            }
            // Return the 'app' directory
            // console.log(appDir);
            const appPath = path.join(srcPath, appDir.name);
            // console.log(appPath);
            return appPath;
        }
        catch (err) {
            console.log('error');
            return 'Error reading workspace: ' + err.message;
        }
    }
    else {
        return 'No workspace folder opened.';
    }
}
exports.findDir = findDir;
//# sourceMappingURL=functions.js.map