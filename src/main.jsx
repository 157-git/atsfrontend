import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  // this is commented by sahil karnekar because it was creating problem while user connecting with socket client because it renders the component twise
  // <React.StrictMode>
    <App />
 // </React.StrictMode>
)
