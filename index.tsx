import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Ensure root element has proper styling
rootElement.style.minHeight = '100vh';
rootElement.style.width = '100%';

const root = ReactDOM.createRoot(rootElement);

// Add error boundary at root level
try {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error('Failed to render app:', error);
  rootElement.innerHTML = `
    <div style="display: flex; justify-content: center; align-items: center; min-height: 100vh; color: #e4e4e7; font-family: 'Inter', sans-serif;">
      <div style="text-align: center;">
        <h1 style="color: #fbbf24; margin-bottom: 1rem;">Error Loading App</h1>
        <p style="color: #a1a1aa;">${error instanceof Error ? error.message : 'Unknown error'}</p>
        <p style="color: #71717a; margin-top: 1rem; font-size: 0.875rem;">Check the console for details</p>
      </div>
    </div>
  `;
}