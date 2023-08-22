"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const path = require("path");
const makeTree_1 = require("./makeTree");
const fs_1 = require("fs");
function activate(context) {
    console.log('Congratulations, your extension "next-extension" is now active!');
    let disposable = vscode.commands.registerCommand('next-extension.helloWorld', async () => {
        const result = await (0, makeTree_1.default)();
        const sendString = JSON.stringify(result);
        vscode.window.showInformationMessage(sendString);
        const webview = vscode.window.createWebviewPanel('reactWebview', 'React Webview', vscode.ViewColumn.One, {
            enableScripts: true,
        });
        webview.webview.postMessage({ command: 'sendString', data: sendString });
        const scriptPathOnDisk = vscode.Uri.file(path.join(context.extensionPath, 'webview-react-app', 'dist', 'bundle.js'));
        const scriptUri = scriptPathOnDisk.with({ scheme: 'vscode-resource' });
        // Read the content of the bundle.js file and insert it directly into the script tag
        try {
            const bundlePath = path.join(context.extensionPath, 'webview-react-app', 'dist', 'bundle.js');
            const bundleContent = await fs_1.promises.readFile(bundlePath, 'utf-8');
            webview.webview.html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>React Webview</title>
        </head>
        <body>
          <div id="root"></div>
          <script>
          ${bundleContent}
          </script>
        </body>
        </html>`;
        }
        catch (err) {
            console.error('Error reading bundle.js:', err);
        }
        vscode.window.showInformationMessage('Hello, World!');
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map