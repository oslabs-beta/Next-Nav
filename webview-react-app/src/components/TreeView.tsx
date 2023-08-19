// import { initialNodes, initialEdges } from './nodes-edges.tsx';
import ELK, { ElkNode } from 'elkjs/lib/elk.bundled.js';
import React, { useCallback, useLayoutEffect } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  Panel,
  useNodesState,
  useEdgesState,
  useReactFlow,
  Edge,
  Connection,
} from 'reactflow';

import 'reactflow/dist/style.css';

const elk = new ELK();

// Elk has a *huge* amount of options to configure. To see everything you can
// tweak check out:
//
// - https://www.eclipse.org/elk/reference/algorithms.html
// - https://www.eclipse.org/elk/reference/options.html
const elkOptions = {
  'elk.algorithm': 'layered',
  'elk.layered.spacing.nodeNodeBetweenLayers': '200',
  'elk.spacing.nodeNode': '100',
};

type FileNode = {
  id: number;
  folderName: string;
  parentNode: number | null;
  contents?: string[];
};

type Tree = FileNode[];

const initialNodes: any[] = [];
const initialEdges: any[] = [];
const parseData = (serverResponse: Tree) => {
  const position = { x: 0, y: 0 };
  //create initialNodes
  serverResponse.forEach((obj) => {
    initialNodes.push({
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
    if (obj.parentNode !== null) {
      initialEdges.push({
        id: `${obj.parentNode}`,
        source: `${obj.parentNode}`,
        target: `${obj.id}`,
        type: 'smoothstep',
      });
    }
  });
  //create initialEdges
};

// //fetch request
parseData([
  {
    id: 0,
    folderName: 'app',
    parentNode: null,
    contents: ['globals.css', 'layout.js', 'page.jsx', 'page.module.css'],
  },
  {
    id: 1,
    folderName: 'about',
    parentNode: 0,
    contents: ['page.jsx', 'page.module.css'],
  },
  {
    id: 2,
    folderName: 'blog',
    parentNode: 0,
    contents: ['page.jsx', 'page.module.css'],
  },
  {
    id: 3,
    folderName: '[id]',
    parentNode: 2,
    contents: ['page.jsx', 'page.module.css'],
  },
  {
    id: 4,
    folderName: 'contact',
    parentNode: 0,
    contents: ['loading.jsx', 'page.jsx', 'page.module.css'],
  },
  {
    id: 5,
    folderName: 'dashboard',
    parentNode: 0,
    contents: ['page.jsx', 'page.module.css'],
  },
  {
    id: 6,
    folderName: '(auth)',
    parentNode: 5,
    contents: [],
  },
  {
    id: 7,
    folderName: 'login',
    parentNode: 6,
    contents: ['page.jsx', 'page.module.css'],
  },
  {
    id: 8,
    folderName: 'register',
    parentNode: 6,
    contents: ['page.jsx', 'page.module.css'],
  },
  {
    id: 9,
    folderName: 'logs',
    parentNode: 5,
    contents: [],
  },
  {
    id: 10,
    folderName: 'settings',
    parentNode: 5,
    contents: [],
  },
  {
    id: 11,
    folderName: 'users',
    parentNode: 5,
    contents: [],
  },
  {
    id: 12,
    folderName: 'portfolio',
    parentNode: 0,
    contents: ['page.jsx', 'page.module.css'],
  },
  {
    id: 13,
    folderName: '[category]',
    parentNode: 12,
    contents: ['page.jsx', 'page.module.css'],
  },
]);

// interface customElkNode extends ElkNode {
//   data?: {
//     label: string;
//   };
//   type?: string;
//   position?: {
//     x: number;
//     y: number;
//   };
// }

// interface customElkEdge extends ElkExtendedEdge {
//   type?: string;
// }

const getLayoutedElements = async (
  nodes: any[],
  edges: any[],
  options = { ['elk.direction']: 'RIGHT' }
): Promise<any> => {
  // const isHorizontal = options?.['elk.direction'] === 'RIGHT';
  const isHorizontal: boolean =
    options['elk.direction'] === 'DOWN' ? false : true;
  const graph: ElkNode = {
    id: 'root',
    layoutOptions: options,
    children: nodes.map((node) => ({
      ...node,
      // Adjust the target and source handle positions based on the layout
      // direction.
      targetPosition: isHorizontal ? 'left' : 'top',
      sourcePosition: isHorizontal ? 'right' : 'bottom',

      // Hardcode a width and height for elk to use when layouting.
      width: 150,
      height: 50,
    })),
    edges: edges,
  };
  try {
    const elkGraph = await elk.layout(graph);
    if (!elkGraph.children) elkGraph.children = [];
    console.log('elkGraph', elkGraph);
    return {
      nodes: elkGraph.children.map((node) => ({
        ...node,
        // React Flow expects a position property on the node instead of `x`
        // and `y` fields.
        position: { x: node.x, y: node.y },
      })),

      edges: elkGraph.edges,
    };
  } catch (error) {
    console.log(error);
  }
};

function LayoutFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { fitView } = useReactFlow();

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    []
  );
  const onLayout = useCallback(
    async ({
      direction,
      useInitialNodes = false,
    }: {
      direction: string;
      useInitialNodes?: boolean;
    }): Promise<any> => {
      const opts = { 'elk.direction': direction, ...elkOptions };
      const ns = useInitialNodes ? initialNodes : nodes;
      // const ns = initialNodes;
      const es = useInitialNodes ? initialEdges : edges;
      // const es = initialEdges;

      // getLayoutedElements(ns, es, opts).then(
      //   ({ nodes: layoutedNodes, edges: layoutedEdges }: nodesEdges) => {
      //     setNodes(layoutedNodes);
      //     setEdges(layoutedEdges);

      //     window.requestAnimationFrame(() => fitView());
      //   }
      // );

      const layoutedElms = await getLayoutedElements(ns, es, opts);
      console.log('layouted', layoutedElms);

      setNodes(layoutedElms.nodes);
      setEdges(layoutedElms.edges);

      window.requestAnimationFrame(() => fitView());
    },
    [nodes, edges]
  );

  // Calculate the initial layout on mount.
  useLayoutEffect(() => {
    onLayout({ direction: 'DOWN', useInitialNodes: true });
  }, []);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onConnect={onConnect}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      fitView
    >
      <Panel position="top-right">
        <button onClick={() => onLayout({ direction: 'DOWN' })}>
          vertical layout
        </button>

        <button onClick={() => onLayout({ direction: 'RIGHT' })}>
          horizontal layout
        </button>
      </Panel>
    </ReactFlow>
  );
}

export default function TreeView() {
  return (
    <div style={{ width: '80vw', height: '80vh', display: 'flex' }}>
      <ReactFlowProvider>
        <LayoutFlow />
      </ReactFlowProvider>
      <div>
        <h1>Test your app</h1>
        {/* <button onClick={}>Button</button> */}
      </div>
    </div>
  );
}
