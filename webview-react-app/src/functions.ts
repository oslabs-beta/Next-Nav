import { useVsCodeApi } from './VsCodeApiContext';

// //all of the different messages
const vscode = useVsCodeApi();
//get directory
export const handleRequestDirectory = (
  srcDirRef: string,
  appDirRef: string
) => {
  console.log('srcDir: ', srcDirRef, ' appDir: ', appDirRef);
  vscode.postMessage({
    command: 'getRequest',
    src: srcDirRef || 'src',
    app: appDirRef || 'app',
  });
};

export const handleReceivedMessage = (
  event: MessageEvent,
  setDirectory: (state: string) => void,
  srcDirRef: string,
  appDirRef: string
) => {
  const message = event.data;
  switch (message.command) {
    //get directory
    case 'sendString':
      const formattedDirectory = JSON.stringify(
        JSON.parse(message.data),
        null,
        2
      );
      setDirectory(formattedDirectory);
      break;
    //file was just added we need to get directory again
    case 'added_addFile':
      console.log('file added');
      handleRequestDirectory(srcDirRef, appDirRef);
      break;
    //file was just deleted we need to get directory again
    case 'added_deleteFile':
      console.log('file deleted');
      handleRequestDirectory(srcDirRef, appDirRef);
      break;
  }
};

//open a tab
export const handleOpenFile = (filePath: string) => {
  vscode.postMessage({
    command: 'open_file',
    filePath: filePath,
  });
};

//add a file need path and filename.extension
export const handleAddFile = (filePath: string, addFileName: string) => {
  console.log(filePath);
  vscode.postMessage({
    command: 'addFile',
    path: filePath,
    fileName: addFileName,
  });
};

//delete a file need path and filename.extension
export const handleDeleteFile = (filePath: string, deleteFileName: string) => {
  vscode.postMessage({
    command: 'deleteFile',
    path: filePath,
    fileName: deleteFileName,
  });
};
