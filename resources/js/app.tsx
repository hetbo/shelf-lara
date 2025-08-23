import './bootstrap';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';

// TypeScript knows that getElementById can return null, so we must check for it.
const rootElement = document.getElementById('app');

if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <div className="bg-neutral-800 text-white h-screen p-2">
            <App />
        </div>
    );
} else {
    console.error('Failed to find the root element with id "app".');
}
