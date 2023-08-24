import React, { createContext, useContext, ReactNode } from "react";

declare global {
  interface Window {
    acquireVsCodeApi: () => any;
  }
}

const VsCodeApiContext = createContext<any>(null);

interface VsCodeApiProviderProps {
  children: ReactNode;
}

export const VsCodeApiProvider: React.FC<VsCodeApiProviderProps> = ({
  children,
}) => {
  const vscode = window.acquireVsCodeApi();
  return (
    <VsCodeApiContext.Provider value={vscode}>
      {children}
    </VsCodeApiContext.Provider>
  );
};

export const useVsCodeApi = () => {
  return useContext(VsCodeApiContext);
};
