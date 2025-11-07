import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import { AppProviders } from './contexts/AppProviders.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <AppProviders>
        <App />
      </AppProviders>
    </Router>
  </StrictMode>,
)