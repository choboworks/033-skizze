// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './app/App'

const rootEl = document.getElementById('root')
if (!rootEl) throw new Error('#root not found')

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
