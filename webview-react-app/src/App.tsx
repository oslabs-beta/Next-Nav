import TreeContainer from "./components/TreeContainer";
import { ChakraProvider } from "@chakra-ui/react";
import React, { useState, useEffect, useRef } from "react";
import { useVsCodeApi } from "./VsCodeApiContext";


const App: React.FC = () => {
  const vscode = useVsCodeApi();

  return (
    //Provides Charka library to the elements inside
    <ChakraProvider>
      <TreeContainer />
    </ChakraProvider>
  );
};

export default App;
