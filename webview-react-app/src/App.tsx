import React, { useState, useEffect } from 'react';
import { useVsCodeApi } from './VsCodeApiContext';


const App: React.FC = () => {
  const [directory, setDirectory] = useState('nothing here');
  const [srcDir, setSrcDir] = useState('');
  const [appDir, setAppDir] = useState('');
  const vscode = useVsCodeApi();

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
        setDirectory(message.data);
        break;
    }
  };

  const handleRequestDirectory = () => {
    vscode.postMessage({
      command: 'getRequest',
      src: srcDir,
      app: appDir
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
      <p>This is a simple React component running inside a VS Code extension.</p>
      <p>Directory list: {directory} </p>
    </div>
  );
};

export default App;
