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

import 'reactflow/dist/base.css';

import '../../style.css';

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

// type FileNode = {
//   id: number;
//   folderName: string;
//   parentNode: number | null;
//   contents?: string[];
// };

// type Tree = FileNode[];

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
      width: 200,
      height: 300,
    })),
    edges: edges,
  };
  try {
    const elkGraph = await elk.layout(graph); //this is what's failing
    if (!elkGraph.children) {
      elkGraph.children = [];
    }
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
    console.log('catch block failed: ', error);
  }
};

type props = {
  initialNodes: any[];
  initialEdges: any[];
};

export default function LayoutFlow({ initialNodes, initialEdges }: props) {
  // console.log('component rendered');
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
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
      console.log('OnLayout-nodes', ns);
      // const ns = initialNodes;
      const es = useInitialNodes ? initialEdges : edges;
      console.log('OnLayout-edges', es);
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
    [nodes, edges, initialNodes]
  );

  // Calculate the initial layout on mount.
  useLayoutEffect(() => {
    console.log('initNodes', initialNodes);

    //sets the initial direction of the graph:
    onLayout({ direction: 'RIGHT', useInitialNodes: true });
  }, [initialNodes]);

  const reactFlowStyle = {
    background: 'gray',
  };

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onConnect={onConnect}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      style={reactFlowStyle}
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
