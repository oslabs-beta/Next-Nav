import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { VsCodeApiProvider } from './VsCodeApiContext'; // Make sure you import it from the correct file


ReactDOM.render(
  <React.StrictMode>
    <VsCodeApiProvider>
      <App />
    </VsCodeApiProvider>
  </React.StrictMode>,
  document.getElementById('root')
);