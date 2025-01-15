import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
// this line 6 and 7 added by sahil karnekar date 14-01-2025
import { Provider } from "react-redux";
import store from "../src/EmployeeDashboard/store.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
  // this is commented by sahil karnekar because it was creating problem while user connecting with socket client because it renders the component twise
  // <React.StrictMode>
  // this line 13 to 15 added by sahil karnekar date 14-01-2025
  <Provider store={store}>
  <App />
</Provider>
 // </React.StrictMode>
)
