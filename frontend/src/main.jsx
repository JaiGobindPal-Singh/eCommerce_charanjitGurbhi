import Notification from './components/Notification.jsx'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import ScrollToTop from './components/ScrollToTop.jsx'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <BrowserRouter>
    <ScrollToTop />
      <App />
      <Notification/>
    </BrowserRouter>
  // {/* </StrictMode> */}
)
