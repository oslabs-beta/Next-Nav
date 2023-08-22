import React from 'react';
import TreeContainer from './components/TreeContainer';
import { ChakraProvider } from '@chakra-ui/react';

const App: React.FC = () => {
  return (
    <ChakraProvider>
      <TreeContainer />
    </ChakraProvider>
  );
};

export default App;
