import React, { useState, useEffect, useRef } from 'react';
import { useVsCodeApi } from './VsCodeApiContext';

const App: React.FC = () => {
  const [directory, setDirectory] = useState('nothing here');
  const [srcDir, setSrcDir] = useState('');
  const [appDir, setAppDir] = useState('');
  const [filePath, setFilePath] = useState('');
  const [addFileName, setAddFileName] = useState('');
  const [deleteFileName, setDeleteFileName] = useState('');
  const srcDirRef = useRef('');
  const appDirRef = useRef('');
  const vscode = useVsCodeApi();

  // Update the refs whenever srcDir or appDir changes
  useEffect(() => {
    srcDirRef.current = srcDir;
    appDirRef.current = appDir;
  }, [srcDir, appDir]);

  useEffect(() => {
    window.addEventListener('message', handleReceivedMessage);
    return () => {
      window.removeEventListener('message', handleReceivedMessage);
    };
  }, []);

  const handleReceivedMessage = (event: MessageEvent) => {
    const message = event.data;
    switch (message.command) {
      case 'sendString':
        const formattedDirectory = JSON.stringify(JSON.parse(message.data), null, 2);
        setDirectory(formattedDirectory);
        break;
      case 'added_addFile':
        console.log('file added');
        handleRequestDirectory();
        break;
      case 'added_deleteFile':
        console.log('file deleted');
        handleRequestDirectory();
        break;
    }
  };

  const handleRequestDirectory = () => {
    console.log('srcDir: ', srcDirRef.current, ' appDir: ', appDirRef.current);
    vscode.postMessage({
      command: 'getRequest',
      src: srcDirRef.current || 'src',
      app: appDirRef.current || 'app',
    });
  };

  const handleOpenFile = () => {
    vscode.postMessage({
      command: 'open_file',
      filePath
    });
  };

  const handleAddFile = () => {
    console.log(filePath);
    vscode.postMessage({
      command: 'addFile',
      path: filePath,
      fileName: addFileName
    });
  };

  const handleDeleteFile = () => {
    vscode.postMessage({
      command: 'deleteFile',
      path: filePath,
      fileName: deleteFileName
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
      <input
        type="text"
        placeholder="Enter app directory"
        value={appDir}
        onChange={(e) => setAppDir(e.target.value)}
      />
      <button onClick={handleRequestDirectory}>Request Directory</button>
      <br />
      <input
        type="text"
        placeholder="Enter file path"
        value={filePath}
        onChange={(e) => setFilePath(e.target.value)}
      />
      <button onClick={handleOpenFile}>Open File</button>
      <br />
      <input
        type="text"
        placeholder="Enter file name to add"
        value={addFileName}
        onChange={(e) => setAddFileName(e.target.value)}
      />
      <button onClick={handleAddFile}>Add</button>
      <br />
      <input
        type="text"
        placeholder="Enter file name to delete"
        value={deleteFileName}
        onChange={(e) => setDeleteFileName(e.target.value)}
      />
      <button onClick={handleDeleteFile}>Delete</button>
      <br />
      <p>This is a simple React component running inside a VS Code extension.</p>
      <pre>Directory list: {directory} </pre>
    </div>
  );
};

export default App;
