import * as vscode from 'vscode';
import * as path from 'path';
import treeMaker from './makeTree';
import { promises as fs } from 'fs';


//get the directory to send to the React
async function sendUpdatedDirectory(webview: vscode.WebviewPanel, src: string, app: string): Promise<void> {
  try {
    //tree maker builds it
    const result = await treeMaker(src, app);
    const sendString = JSON.stringify(result);
    webview.webview.postMessage({ command: 'sendString', data: sendString });
  } catch (error: any) {
    console.error('Error sending updated directory:', error.message);
    vscode.window.showErrorMessage('Error sending updated directory: ' + error.message);
  }
}

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "next-extension" is now active!');
  //runs when extension is called every time
  let disposable = vscode.commands.registerCommand('next-extension.helloWorld', async () => {
    //create a webview to put React on
    const webview = vscode.window.createWebviewPanel(
      'reactWebview',
      'React Webview',
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true
      }
    );
    //When we get requests from React
    webview.webview.onDidReceiveMessage(
      async message => {
        switch (message.command) {
          //send directory to React
          case 'getRequest':
            await sendUpdatedDirectory(webview, message.src, message.app);
            break;
          // open a file in the extension
          case 'open_file':
            const filePath = message.filePath;
            try {
              const document = await vscode.workspace.openTextDocument(filePath);
              await vscode.window.showTextDocument(document);
              console.log(`Switched to tab with file: ${filePath}`);
            } catch (err: any) {
              vscode.window.showErrorMessage(`Error opening file: ${err.message}`);
              console.error(`Error opening file: ${err}`);
            }
            break;
          //add a new file in at specified path
          case 'addFile':
            try {
              const filePath = path.join(message.path, message.fileName);
              await fs.writeFile(filePath, 'This is your new file!');
              //let the React know we added a file
              webview.webview.postMessage({ command: 'added_addFile' });
            } catch (error: any) {
              console.error('Error creating file:', error.message);
              vscode.window.showErrorMessage('Error creating file: ' + error.message);
            }
            break;
          //delete a file at specified path
          case 'deleteFile':
            try {
              const filePath = path.join(message.path, message.fileName);
              if (await fs.stat(filePath)) {
                await fs.unlink(filePath);
              } else {
                throw new Error('File does not exist');
              }
              //let the React know we deleted a file
              webview.webview.postMessage({ command: 'added_deleteFile' });
            } catch (error: any) {
              console.error('Error deleting file:', error.message);
              vscode.window.showErrorMessage('Error deleting file: ' + error.message);
            }
            break;
        }
      },
      undefined,
      context.subscriptions
    );

    try {
      //bundle for react code
      const bundlePath = path.join(context.extensionPath, 'webview-react-app', 'dist', 'bundle.js');
      const bundleContent = await fs.readFile(bundlePath, 'utf-8');
      //html in the webview to put our react code into
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
    } catch (err) {
      console.error('Error reading bundle.js:', err);
    }

    vscode.window.showInformationMessage('Hello, World!');
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
