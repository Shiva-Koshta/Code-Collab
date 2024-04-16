import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'


export function renderApp() {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<App />);
}

window.addEventListener("DOMContentLoaded", function (e) {
  renderApp();
});

reportWebVitals();

