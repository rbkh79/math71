
import React from 'react';
// Ensure these specific imports match your importmap for react-dom/client and jsx-runtime
import ReactDOM from 'react-dom/client'; 
import App from './App';
// Tailwind styles are loaded via CDN in index.html

// The import 'react/jsx-runtime' is typically handled by the transpiler (Babel here)
// when JSX is used. If you were to import it directly, it would be:
// import {} from 'react/jsx-runtime'; 
// But usually, it's not needed as an explicit import in your component files when using Babel.

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);