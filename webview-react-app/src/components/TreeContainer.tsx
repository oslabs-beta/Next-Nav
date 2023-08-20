import React, { useState } from 'react';
import LayoutFlow from './LayoutFlow';
import { ReactFlowProvider } from 'reactflow';

type FileNode = {
  id: number;
  folderName: string;
  parentNode: number | null;
  contents?: string[];
};

type Tree = FileNode[];

const initNodes = [
  {
    id: '0',
    folderName: 'app',
    parentNode: 'null',
    contents: ['globals.css', 'layout.js', 'page.jsx', 'page.module.css'],
  },
  {
    id: '1',
    folderName: 'about',
    parentNode: '0',
    contents: ['page.jsx', 'page.module.css'],
  },
  {
    id: '2',
    folderName: 'blog',
    parentNode: '0',
    contents: ['page.jsx', 'page.module.css'],
  },
  {
    id: '3',
    folderName: '[id]',
    parentNode: '2',
    contents: ['page.jsx', 'page.module.css'],
  },
  {
    id: '4',
    folderName: 'contact',
    parentNode: '0',
    contents: ['loading.jsx', 'page.jsx', 'page.module.css'],
  },
];

const initEdges = [
  { id: 'e12', source: '0', target: '1', type: 'smoothstep' },
  { id: 'e13', source: '0', target: '2', type: 'smoothstep' },
  { id: 'e22a', source: '1', target: '4', type: 'smoothstep' },
];

export default function TreeContainer() {
  const [initialNodes, setInitialNodes] = useState(initNodes);
  const [initialEdges, setInitialEdges] = useState(initEdges);

  const parseData = (serverResponse: Tree) => {
    const position = { x: 0, y: 0 };
    //create initialNodes
    const newNodes: any[] = [];
    const newEdges: any[] = [];
    serverResponse.forEach((obj) => {
      newNodes.push({
        id: `${obj.id}`,
        data: {
          label: (
            <div>
              {obj.folderName}
              <ul>{obj.contents}</ul>
              <button>View</button>
            </div>
          ),
        },
        position,
      });
      //create initialEdges
      if (obj.parentNode !== null) {
        newEdges.push({
          id: `${obj.parentNode}`,
          source: `${obj.parentNode}`,
          target: `${obj.id}`,
          type: 'smoothstep',
        });
      }
    });
    setInitialNodes(newNodes);
    setInitialEdges(newEdges);
  };

  return (
    <div style={{ width: '80vw', height: '80vh', display: 'flex' }}>
      <ReactFlowProvider>
        <LayoutFlow initialNodes={initialNodes} initialEdges={initialEdges} />
      </ReactFlowProvider>
      <div>
        <h1>Test your app</h1>
        {/* <button onClick={}>Button</button> */}
      </div>
    </div>
  );
}
