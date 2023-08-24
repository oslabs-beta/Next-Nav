import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { VsCodeApiProvider } from './VsCodeApiContext'; // Make sure you import it from the correct file

//wrap app in VsCodeApiProvider component
ReactDOM.render(
  <VsCodeApiProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </VsCodeApiProvider>,
  document.getElementById('root')
);
