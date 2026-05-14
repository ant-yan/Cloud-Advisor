import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AdvisorProvider } from './context/AdvisorContext';
import App from './App';
import './styles/globals.css';
import './i18n';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <AdvisorProvider>
          <App />
        </AdvisorProvider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);
