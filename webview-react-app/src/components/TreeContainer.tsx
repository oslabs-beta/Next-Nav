import React, { useEffect, useRef, useState } from "react";
import LayoutFlow from "./LayoutFlow";
import { ReactFlowProvider, Controls, MiniMap } from "reactflow";
import Node from "./Node";
// import { handleReceivedMessage, handleRequestDirectory } from "../functions";
import { useVsCodeApi } from "../VsCodeApiContext";

export type FileNode = {
  id: number;
  folderName: string;
  parentNode: number | null;
  contents: string[];
  path: string;
  render: string;
};

export type Tree = FileNode[];

//---Dumby data to show on initial load---//
const initNodes: Tree = [
  {
    id: 0,
    folderName: "Root",
    parentNode: null,
    contents: ["globals.css", "layout.js", "page.jsx", "page.module.css"],
    path: "",
    render: "server",
  },
  {
    id: 1,
    folderName: "Child",
    parentNode: 0,
    contents: ["page.jsx", "page.module.css"],
    path: "",
    render: "server",
  },
  {
    id: 2,
    folderName: "Child",
    parentNode: 0,
    contents: ["page.jsx", "page.module.css"],
    path: "",
    render: "server",
  },
  {
    id: 3,
    folderName: "Sub-Child",
    parentNode: 2,
    contents: ["page.jsx", "page.module.css"],
    path: "",
    render: "server",
  },
  {
    id: 4,
    folderName: "Sub-Child",
    parentNode: 2,
    contents: ["page.jsx", "page.module.css"],
    path: "",
    render: "client",
  },
  {
    id: 5,
    folderName: "Child",
    parentNode: 0,
    contents: ["loading.jsx", "page.jsx", "page.module.css"],
    path: "",
    render: "server",
  },
];

const tutorialTree = JSON.stringify(initNodes);

//---COMPONENTS---//
export default function TreeContainer() {
  const [initialNodes, setInitialNodes] = useState<any[]>([]);
  const [initialEdges, setInitialEdges] = useState<any[]>([]);
  const [isParsed, setIsParsed] = useState(false); //tracks if the parseData function was called
  const [directory, setDirectory] = useState(tutorialTree);
  const vscode = useVsCodeApi();

  //state for communicating with "backend"
  const [srcDir, setSrcDir] = useState("src");
  const [appDir, setAppDir] = useState("app");
  const srcDirRef = useRef("src");
  const appDirRef = useRef("app");

  //state for managing path input
  const [validDir, setValidDir] = useState(false);
  const [dirFormValue, setDirFormValue] = useState("src/app");

  // Update the refs whenever srcDir or appDir changes
  useEffect(() => {
    srcDirRef.current = srcDir;
    appDirRef.current = appDir;
    window.addEventListener("message", (e) =>
      handleReceivedMessage(
        e,
        setDirectory,
        srcDirRef.current,
        appDirRef.current
      )
    );
    return () => {
      window.removeEventListener("message", (e) =>
        handleReceivedMessage(
          e,
          setDirectory,
          srcDirRef.current,
          appDirRef.current
        )
      );
    };
  }, [srcDir, appDir]);

  const handleRequestDirectory = (srcDirRef: string, appDirRef: string) => {
    console.log("srcDir: ", srcDirRef, " appDir: ", appDirRef);
    console.log("asking for directory");
    vscode.postMessage({
      command: "getRequest",
      src: srcDirRef || "src",
      app: appDirRef || "app",
    });
  };

  const handleReceivedMessage = (
    event: MessageEvent,
    setDirectory: (state: string) => void,
    srcDirRef: string,
    appDirRef: string
  ) => {
    const message = event.data;
    switch (message.command) {
      //get directory
      case "sendString":
        console.log("getting directory");
        const formattedDirectory = JSON.stringify(
          JSON.parse(message.data),
          null,
          2
        );
        if (formattedDirectory.length) {
          setDirectory(formattedDirectory);
        }
        break;
      //file was just added we need to get directory again
      case "added_addFile":
        console.log("file added");
        handleRequestDirectory(srcDirRef, appDirRef);
        break;
      //file was just deleted we need to get directory again
      case "added_deleteFile":
        console.log("file deleted");
        handleRequestDirectory(srcDirRef, appDirRef);
        break;
      //folder was just added we need to get directory again
      case "added_addFolder":
        console.log("folder added");
        handleRequestDirectory(srcDirRef, appDirRef);
        break;
      //folder was just deleted we need to get directory again
      case "added_deleteFolder":
        console.log("folder deleted");
        handleRequestDirectory(srcDirRef, appDirRef);
        break;
      case "submitDirResponse":
        console.log("recieved", message);
        setValidDir(message.result);
        if (message.result) {
          handleRequestDirectory(srcDirRef, appDirRef);
        }
    }
  };

  const parseData = (serverResponse: Tree) => {
    const position = { x: 0, y: 0 };

    const newNodes: any[] = [];
    const newEdges: any[] = [];

    //function that sends messages to the extension/backend
    //This function is drilled down to the modal components and invoked there
    const handlePostMessage: (
      filePath: string,
      command: string,
      setterFunc?: (string: string) => any
    ) => void = (filePath, command, setterFunc) => {
      vscode.postMessage({
        command: command,
        filePath: filePath,
      });
      if (setterFunc) {
        setterFunc("");
      }
    };

    serverResponse.forEach((obj) => {
      //populate the newNodes with the data from the "server"
      newNodes.push({
        id: `${obj.id}`,
        data: {
          label: <Node data={obj} handlePostMessage={handlePostMessage} />,
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
          animated: true, //displays marching ants
        });
      }
    });

    //update state with new nodes and edges
    setInitialNodes(newNodes);
    setInitialEdges(newEdges);
    setIsParsed(true);
  };

  //invoked parseData to show tutorial tree
  useEffect(() => {
    parseData(JSON.parse(directory));
  }, [directory]);

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
              srcDir={srcDir}
              appDir={appDir}
              parseData={() => {
                parseData(JSON.parse(directory));
              }}
              handleRequestDir={() => {
                handleRequestDirectory(srcDir, appDir);
              }}
              validDir={validDir}
              dirFormValue={dirFormValue}
              setDirFormValue={setDirFormValue}
              />
          </ReactFlowProvider>
        </div>
      ) : (
        <div>Nothing to Display</div>
      )}
    </div>
  );
}
