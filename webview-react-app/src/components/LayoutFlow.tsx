// import { initialNodes, initialEdges } from './nodes-edges.tsx';
import ELK, { ElkNode } from "elkjs/lib/elk.bundled.js";
import React, {
  useState,
  useCallback,
  useLayoutEffect,
  useEffect,
} from "react";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  Panel,
  useNodesState,
  useEdgesState,
  useReactFlow,
  Edge,
  Connection,
} from "reactflow";
import {
  Card,
  Button,
  Heading,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  FormHelperText,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
} from "@chakra-ui/react";
import { VsCodeApiProvider, useVsCodeApi } from "../VsCodeApiContext";

export type FileNode = {
  id: number;
  folderName: string;
  parentNode: number | null;
  contents?: string[];
  path?: string;
};

export type Tree = FileNode[];

//import the empty styles from reactflow to allow for other styles
import "reactflow/dist/base.css";
//import styles from NextNav style.css file.
//This import is required to remove ReactFlow borders
import "../../style.css";

const elk = new ELK();

// Elk has a *huge* amount of options to configure. To see everything you can
// tweak check out:
//
// - https://www.eclipse.org/elk/reference/algorithms.html
// - https://www.eclipse.org/elk/reference/options.html
const elkOptions = {
  "elk.algorithm": "layered",
  "elk.layered.spacing.nodeNodeBetweenLayers": "200",
  "elk.spacing.nodeNode": "100",
};

//---For Update the types later--??
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
//------------//

//Retrieves the nodes with updated positions from elkJS
const getLayoutedElements = async (
  nodes: any[],
  edges: any[],
  options = { ["elk.direction"]: "RIGHT" }
): Promise<any> => {
  //Changes the Direction of the graph based on the input
  const isHorizontal: boolean =
    options["elk.direction"] === "DOWN" ? false : true;

  //Forms data to pass to ELK function
  const graph: ElkNode = {
    id: "root",
    layoutOptions: options,
    children: nodes.map((node) => ({
      ...node,
      // Adjust the target and source handle positions based on the layout
      // direction.
      targetPosition: isHorizontal ? "left" : "top",
      sourcePosition: isHorizontal ? "right" : "bottom",

      // Hardcode a width and height for elk to use when layouting.
      //Adjust this to change the spacing between nodes
      width: 200,
      height: 200,
    })),
    edges: edges,
  };

  try {
    const elkGraph = await elk.layout(graph); //retrieves the new nodes with new positions
    if (!elkGraph.children) {
      elkGraph.children = []; //prevents elkGraph.children from being undefined
    }

    console.log("elkGraph", elkGraph);
    return {
      nodes: elkGraph.children.map((node) => ({
        ...node,
        //applies the positions to the child nodes to be readble for ReactFlow
        position: { x: node.x, y: node.y },
      })),

      edges: elkGraph.edges,
    };
  } catch (error) {
    //Displayed when the wrong data is passed to elk.layout
    console.log("catch block failed: ", error);
  }
};

type props = {
  initialNodes: any[];
  initialEdges: any[];
  srcDir: string;
  appDir: string;
  parseData: () => void;
  handleRequestDir: () => void;
  validDir: boolean;
  dirFormValue: string;
  setDirFormValue: (string: string) => void;
};

export default function LayoutFlow({
  initialNodes,
  initialEdges,
  parseData,
  handleRequestDir,
  validDir,
  dirFormValue,
  setDirFormValue,
}: props) {
  // console.log('component rendered');
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { fitView } = useReactFlow(); //needed to position the tree within the window
  const vscode = useVsCodeApi();

  //For when a use connects a node. Not needed currently
  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  //Caches a function that retrieves the positions from the nodes from getLayoutedElements
  //This funciton persists between loads, unless one of the dependencies change.
  //All variables associated with this funciton are cached as well.
  const onLayout = useCallback(
    async ({
      direction,
      useInitialNodes = false,
    }: {
      direction: string;
      useInitialNodes?: boolean;
    }): Promise<any> => {
      const opts = { "elk.direction": direction, ...elkOptions };
      const ns = useInitialNodes ? initialNodes : nodes;
      console.log("OnLayout-nodes", ns);

      const es = useInitialNodes ? initialEdges : edges;
      console.log("OnLayout-edges", es);

      //gets the new nodes from the result of getLayoutedElements
      const layoutedElms = await getLayoutedElements(ns, es, opts);
      console.log("layouted", layoutedElms);

      setNodes(layoutedElms.nodes);
      setEdges(layoutedElms.edges);

      //adjusts the view based on the new tree
      window.requestAnimationFrame(() => fitView());
    },
    //initialNodes is a required dependency to make the useCalbback cache a new function with new data
    [nodes, edges, initialNodes]
  );

  // Calculate the initial layout on mount.
  useLayoutEffect(() => {
    console.log("initNodes", initialNodes);

    //sets the initial direction of the graph:
    onLayout({ direction: "RIGHT", useInitialNodes: true });
  }, [initialNodes]);

  //BACKGROUND OF THE APP
  const reactFlowStyle = {
    background: "linear-gradient(#212121, #000000)",
  };

  const handleSubmitDir = () => {
    console.log(vscode);
    console.log("Sending directory", dirFormValue);
    vscode.postMessage({
      command: "submitDir",
      folderName: dirFormValue,
    });
  };

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onConnect={onConnect}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      deleteKeyCode={null}
      style={reactFlowStyle}
      minZoom={0.1} //Required to show the full tree and allow user to zoom out more.
    >
      {/*Stores the buttons in the top right*/}
      <Panel position="top-right">
        <Heading color="#FFFFFF">Next.Nav</Heading>
        <Card
          flexDir="column"
          gap="1.5rem"
          padding="2vh 20px"
          borderRadius="10px"
          mr="10px"
          mt="10px"
          boxShadow="2xl"
          bgColor="#454545">
          {validDir ? (
            <Button
              fontSize="10px"
              bgColor="#010101"
              color="white"
              onClick={() => {
                handleRequestDir();
                parseData();
              }}>
              Refresh
            </Button>
          ) : (
            ""
          )}
          <Button
            bgColor="#010101"
            color="white"
            fontSize="10px"
            onClick={() => {
              onLayout({ direction: "DOWN" });
            }}>
            vertical layout
          </Button>
          <Button
            bgColor="#010101"
            color="white"
            fontSize="10px"
            onClick={() => {
              onLayout({ direction: "RIGHT" });
            }}>
            horizontal layout
          </Button>
        </Card>
      </Panel>
      <Panel position="top-left">
        <Popover>
          <PopoverTrigger>
            <Button>Select File</Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverBody>
              <FormControl>
                <FormLabel>Paste your app path here</FormLabel>
                <Input
                  value={dirFormValue}
                  onChange={(e) => {
                    setDirFormValue(e.target.value);
                  }}
                />
                <FormHelperText>
                  To find path, right click on the app folder and click copy
                  path
                </FormHelperText>
                <Button
                  onClick={() => {
                    handleSubmitDir();
                    setDirFormValue("");
                  }}>
                  Submit
                </Button>
              </FormControl>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </Panel>
    </ReactFlow>
  );
}
