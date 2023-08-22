import React from 'react';
import TreeContainer from './components/TreeContainer';

const App: React.FC = () => {
  return (
    <div>
      <h1>Next.Nav</h1>
      <button>Import Next Project Root Folder</button>
      <TreeContainer />
    </div>
  );
};

export default App;
