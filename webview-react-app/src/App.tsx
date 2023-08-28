import React, { useState, useEffect, useRef } from 'react';
import { useVsCodeApi } from './VsCodeApiContext';

const App: React.FC = () => {
  const [directory, setDirectory] = useState('nothing here');
  const [srcDir, setSrcDir] = useState('');
  const [filePath, setFilePath] = useState('');
  const [addFileName, setAddFileName] = useState('');
  const [deleteFileName, setDeleteFileName] = useState('');
  const [addFolderName, setAddFolderName] = useState('');
  const [deleteFolderName, setDeleteFolderName] = useState('');
  const [validFolder, setValidFolder] = useState(false);
  const srcDirRef = useRef('');
  const vscode = useVsCodeApi();

  // Update the refs whenever srcDir or appDir changes
  useEffect(() => {
    srcDirRef.current = srcDir;
  }, [srcDir]);

  //add listener for messages from backend
  useEffect(() => {
    window.addEventListener('message', handleReceivedMessage);
    return () => {
      window.removeEventListener('message', handleReceivedMessage);
    };
  }, []);

  //all of the different messages
  const handleReceivedMessage = (event: MessageEvent) => {
    const message = event.data;
    switch (message.command) {
      //get directory
      case 'sendString':
        const formattedDirectory = JSON.stringify(JSON.parse(message.data), null, 2);
        setDirectory(formattedDirectory);
        break;
      //file was just added we need to get directory again
      case 'added_addFile':
        console.log('file added');
        handleRequestDirectory();
        break;
      //folder was just added we need to get directory again
      case 'added_addFolder':
        console.log('folder added');
        handleRequestDirectory();
        break;
      //file was just deleted we need to get directory again
      case 'added_deleteFile':
        console.log('file deleted');
        handleRequestDirectory();
        break;
      case 'submitDirResponse':
        console.log('got response from submit folder. it is :' + message.result);
        setValidFolder(message.result);
        break;
      //folder was just deleted we need to get directory again
      case 'added_deleteFolder':
        console.log('folder deleted');
        handleRequestDirectory();
    }
  };

  //get directory
  const handleRequestDirectory = () => {
    vscode.postMessage({
      command: 'getRequest',
    });
  };

  //submit directory
  const handleSubmitDirectory = () => {
    console.log('submitting directory');
    vscode.postMessage({
      command: 'submitDir',
      folderName: srcDirRef.current
    });
  };

    // Open a tab
  const handleOpenFile = (fullFilePath: string) => {
    console.log('Opening file:', fullFilePath);
    vscode.postMessage({
      command: 'open_file',
      filePath: fullFilePath
    });
  };

  // Add a file
  const handleAddFile = (fullFilePath: string) => {
    console.log('Adding file:', fullFilePath);
    vscode.postMessage({
      command: 'addFile',
      filePath: fullFilePath
    });
  };

  // Add a folder
  const handleAddFolder = (fullFolderPath: string) => {
    console.log('Adding folder:', fullFolderPath);
    vscode.postMessage({
      command: 'addFolder',
      filePath: fullFolderPath
    });
  };

  // Delete a file
  const handleDeleteFile = (fullFilePath: string) => {
    console.log('Deleting file:', fullFilePath);
    vscode.postMessage({
      command: 'deleteFile',
      filePath: fullFilePath
    });
  };

  // Delete a folder
  const handleDeleteFolder = (fullFolderPath: string) => {
    console.log('Deleting folder:', fullFolderPath);
    vscode.postMessage({
      command: 'deleteFolder',
      filePath: fullFolderPath
    });
  };


  return (
    <div>
      <h1>Hello, VS Code!</h1>
      <input
        type="text"
        placeholder="Enter src directory"
        value={srcDir}
        onChange={(e) => setSrcDir(e.target.value)}
      />
      <button onClick={handleSubmitDirectory}>Submit Directory</button>
      <br />

      {validFolder && <button onClick={handleRequestDirectory}>Request Directory</button>}
      <br />
      <input
        type="text"
        placeholder="Enter file path"
        value={filePath}
        onChange={(e) => setFilePath(e.target.value)}
      />
      <button onClick={()=>handleOpenFile(filePath)}>Open File</button>
      <br />
      <input
        type="text"
        placeholder="Enter file name to add"
        value={addFileName}
        onChange={(e) => setAddFileName(e.target.value)}
      />
      <button onClick={()=>handleAddFile(addFileName)}>Add</button>
      <br />
      <input
        type="text"
        placeholder="Enter file name to delete"
        value={deleteFileName}
        onChange={(e) => setDeleteFileName(e.target.value)}
      />
      <button onClick={()=>handleDeleteFile(deleteFileName)}>Delete</button>
      <br />
      <input
        type="text"
        placeholder="Enter folder name to add"
        value={addFolderName}
        onChange={(e) => setAddFolderName(e.target.value)}
      />
      <button onClick={()=>handleAddFolder(addFolderName)}>Add Folder</button>
      <br />
      <input
        type="text"
        placeholder="Enter folder name to delete"
        value={deleteFolderName}
        onChange={(e) => setDeleteFolderName(e.target.value)}
      />
      <button onClick={()=>handleDeleteFolder(deleteFolderName)}>Delete Folder</button>
      <br />
      <p>This is a simple React component running inside a VS Code extension.</p>
      <pre>Directory list: {directory} </pre>
    </div>
  );
};

export default App;
