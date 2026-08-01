import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import { ToastContainer } from 'react-toastify'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <BrowserRouter basename="/sudo-admin">
      <App />
      <ToastContainer />
    </BrowserRouter>
  // {/* </StrictMode> */}
)
