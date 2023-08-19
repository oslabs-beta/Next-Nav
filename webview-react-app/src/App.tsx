import React from 'react';
import TreeView from './components/TreeView';

const App: React.FC = () => {
  return (
    <div>
      <h1>Next.Nav</h1>
      <button>Import Next Project Root Folder</button>
      <TreeView />
    </div>
  );
};

export default App;
