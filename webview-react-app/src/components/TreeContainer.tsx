import React, { useEffect, useState } from "react";
import LayoutFlow from "./LayoutFlow";
import { ReactFlowProvider } from "reactflow";
import Node from "./Node";

export type FileNode = {
  id: number;
  folderName: string;
  parentNode: number | null;
  contents?: string[];
  path?: string;
};

export type Tree = FileNode[];

//---Dumby data to show on initial load---//
const initNodes: Tree = [
  {
    id: 0,
    folderName: "Root",
    parentNode: null,
    contents: ["globals.css", "layout.js", "page.jsx", "page.module.css"],
  },
  {
    id: 1,
    folderName: "Child",
    parentNode: 0,
    contents: ["page.jsx", "page.module.css"],
  },
  {
    id: 2,
    folderName: "Child",
    parentNode: 0,
    contents: ["page.jsx", "page.module.css"],
  },
  {
    id: 3,
    folderName: "Sub-Child",
    parentNode: 2,
    contents: ["page.jsx", "page.module.css"],
  },
  {
    id: 4,
    folderName: "Sub-Child",
    parentNode: 2,
    contents: ["page.jsx", "page.module.css"],
  },
  {
    id: 5,
    folderName: "Child",
    parentNode: 0,
    contents: ["loading.jsx", "page.jsx", "page.module.css"],
  },
];

//---COMPONENTS---//
export default function TreeContainer() {
  const [initialNodes, setInitialNodes] = useState<any[]>([]);
  const [initialEdges, setInitialEdges] = useState<any[]>([]);
  const [isParsed, setIsParsed] = useState(false); //tracks if the parseData function was called
  const [directory, setDirectory] = useState("");
  const [viewDirection, setViewDirection] = useState('RIGHT');

  useEffect(() => {
    window.addEventListener("message", handleReceivedMessage);
    return () => {
      window.removeEventListener("message", handleReceivedMessage);
    };
  }, []);

  const handleReceivedMessage = (event: MessageEvent) => {
    const message = event.data;
    switch (message.command) {
      case "sendString":
        setDirectory(message.data);
        break;
    }
  };

  const parseData = (serverResponse: Tree) => {
    const position = { x: 0, y: 0 };

    const newNodes: any[] = [];
    const newEdges: any[] = [];

    serverResponse.forEach((obj) => {
      //populate the newNodes with the data from the "server"
      newNodes.push({
        id: `${obj.id}`,
        data: {
          label: (
            <Node props={obj} direction={viewDirection}/>
          ),
        },
        position,
      });
      //create newEdges from the "server" if the current node has a parent
      if (obj.parentNode !== null) {
        newEdges.push({
          id: `${obj.parentNode}_${obj.id}`,
          source: `${obj.parentNode}`, //this is the parents id
          target: `${obj.id}`,
          type: "smoothstep", //determines the line style
          animated: true //displays marching ants
        });
      }
    });
    //update state with new nodes and edges
    setInitialNodes(newNodes); 
    setInitialEdges(newEdges);
    setIsParsed(true);
  };

  //invoked parseData on load
  useEffect(() => {
    parseData(initNodes);
  }, []);

  return (

    //if isParsed has not been called, don't display the ReactFlow content:
    <div>
      {isParsed ? (
        //this outer div is required to give the size of the ReactFlow window
        <div style={{ width: "100vw", height: "100vh", display: "flex" }}>
          {/* Must Wrap the Layout flow in the ReactFlow component imported from ReactFLOW */}
          <ReactFlowProvider>
            <LayoutFlow
              initialNodes={initialNodes}
              initialEdges={initialEdges}
              setViewDirection={setViewDirection}
              parseData={() => {
                parseData(JSON.parse(directory));
              }}
            />
          </ReactFlowProvider>
        </div>
      ) : (
        <div>Nothing to Display</div>
      )}
    </div>
  );
}
