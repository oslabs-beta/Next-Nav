"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const path = require("path");
const makeTree_1 = require("./makeTree");
const fs_1 = require("fs");
const functions_1 = require("./functions");
let lastSubmittedDir = null; // directory user gave
let webview = null;
//get the directory to send to the React
async function sendUpdatedDirectory(webview, dirName) {
    try {
        // Call treeMaker with only one folder name
        const result = await (0, makeTree_1.default)(dirName);
        const sendString = JSON.stringify(result);
        webview.webview.postMessage({ command: 'sendString', data: sendString });
    }
    catch (error) {
        vscode.window.showErrorMessage('Error sending updated directory: ' + error.message);
    }
}
function activate(context) {
    const iconName = 'next-nav-icon';
    context.globalState.update(iconName, true);
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);
    statusBarItem.text = 'Next.Nav';
    statusBarItem.command = 'next-extension.next-nav';
    statusBarItem.tooltip = 'Launch Next Nav';
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);
    //runs when extension is called every time
    let disposable = vscode.commands.registerCommand('next-extension.next-nav', async () => {
        //search for an existing panel and redirect to that if it exists
        if (webview) {
            webview.reveal(vscode.ViewColumn.One);
        }
        else {
            //create a webview to put React on
            webview = vscode.window.createWebviewPanel('Next.Nav', 'Next.Nav', vscode.ViewColumn.One, {
                enableScripts: true,
                //make the extension persist on tab
                retainContextWhenHidden: true,
            });
            webview.onDidDispose(() => {
                webview = null;
            }, null, context.subscriptions);
            //When we get requests from React
            if (webview === null) {
                throw new Error('Webview is null');
            }
            const cloneView = webview;
            cloneView.webview.onDidReceiveMessage(async (message) => {
                console.log('Received message:', message);
                switch (message.command) {
                    //save directory for future use
                    case 'submitDir':
                        const folderLocation = await (0, functions_1.getValidDirectoryPath)(message.folderName);
                        if (folderLocation) {
                            lastSubmittedDir = folderLocation;
                            vscode.window.showInformationMessage('Directory is now ' + lastSubmittedDir);
                            cloneView.webview.postMessage({
                                command: 'submitDirResponse',
                                result: true,
                            });
                        }
                        else {
                            if (message.showError) {
                                vscode.window.showErrorMessage('Invalid directory: ' + message.folderName);
                            }
                            cloneView.webview.postMessage({
                                command: 'submitDirResponse',
                                result: false,
                            });
                        }
                        break;
                    //send directory to React
                    case 'getRequest':
                        if (lastSubmittedDir) {
                            await sendUpdatedDirectory(cloneView, lastSubmittedDir);
                        }
                        else {
                            console.error('No directory has been submitted yet.');
                            vscode.window.showErrorMessage('No directory has been submitted yet.');
                        }
                        break;
                    // open a file in the extension
                    case 'open_file':
                        const filePath = message.filePath;
                        try {
                            const document = await vscode.workspace.openTextDocument(filePath);
                            await vscode.window.showTextDocument(document);
                            console.log(`Switched to tab with file: ${filePath}`);
                        }
                        catch (err) {
                            vscode.window.showErrorMessage(`Error opening file: ${err.message}`);
                            console.error(`Error opening file: ${err}`);
                        }
                        break;
                    //add a new file in at specified path
                    case 'addFile':
                        try {
                            const filePath = message.filePath;
                            await fs_1.promises.writeFile(filePath, '');
                            //let the React know we added a file
                            cloneView.webview.postMessage({ command: 'added_addFile' });
                        }
                        catch (error) {
                            console.error('Error creating file:', error.message);
                            vscode.window.showErrorMessage('Error creating file: ' + error.message);
                        }
                        break;
                    //add a new folder at a specified path
                    case 'addFolder':
                        try {
                            const folderPath = message.filePath;
                            await fs_1.promises.mkdir(folderPath);
                            cloneView.webview.postMessage({ command: 'added_addFolder' });
                        }
                        catch (error) {
                            console.error('Error creating folder:', error.message);
                            vscode.window.showErrorMessage('Error creating folder: ' + error.message);
                        }
                        break;
                    //delete a file at specified path
                    case 'deleteFile':
                        try {
                            const filePath = message.filePath;
                            const uri = vscode.Uri.file(filePath);
                            if (await fs_1.promises.stat(filePath)) {
                                await vscode.workspace.fs.delete(uri, { useTrash: true });
                            }
                            else {
                                throw new Error('File does not exist');
                            }
                            //let the React know we deleted a file
                            cloneView.webview.postMessage({
                                command: 'added_deleteFile',
                            });
                        }
                        catch (error) {
                            console.error('Error deleting file:', error.message);
                            vscode.window.showErrorMessage('Error deleting file: ' + error.message);
                        }
                        break;
                    //delete a folder at specified path
                    case 'deleteFolder':
                        try {
                            const folderPath = message.filePath;
                            const uri = vscode.Uri.file(folderPath);
                            //delete folder and subfolders
                            if (await fs_1.promises.stat(folderPath)) {
                                await vscode.workspace.fs.delete(uri, {
                                    recursive: true,
                                    useTrash: true,
                                });
                            }
                            else {
                                throw new Error('Folder does not exist');
                            }
                            // Let the React app know that we've successfully deleted a folder
                            cloneView.webview.postMessage({
                                command: 'added_deleteFolder',
                            });
                        }
                        catch (error) {
                            vscode.window.showErrorMessage('Error deleting folder: ' + error.message);
                        }
                        break;
                }
            }, undefined, context.subscriptions);
            try {
                //bundle for react code
                const bundlePath = path.join(context.extensionPath, 'webview-react-app', 'dist', 'bundle.js');
                const bundleContent = await fs_1.promises.readFile(bundlePath, 'utf-8');
                //html in the webview to put our react code into
                webview.webview.html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Next.Nav</title>
          <link rel="icon" type="image/x-icon" href="">
        </head>
        <body>
          <div id="root"></div>
          <script>
          ${bundleContent}
          </script>
        </body>
        </html>`;
            }
            catch (err) { }
            vscode.window.showInformationMessage('Welcome to Next.Nav!');
        }
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map