"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getValidDirectoryPath = void 0;
const fs = require("fs/promises");
const path = require("path");
const vscode = require("vscode");
//Checks that child directory is within parent directory
function isSubdirectory(parent, child) {
    const parentPath = path.resolve(parent).toLowerCase();
    const childPath = path.resolve(child).toLowerCase();
    console.log('p: ' + parentPath);
    console.log('c: ' + childPath);
    return parentPath.startsWith(childPath);
}
async function getValidDirectoryPath(dirPath) {
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
    }
    catch (err) {
        return '';
    }
}
exports.getValidDirectoryPath = getValidDirectoryPath;
//# sourceMappingURL=functions.js.map