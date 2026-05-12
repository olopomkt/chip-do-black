import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { MetaPixelProvider } from './components/analytics/MetaPixelProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MetaPixelProvider pixelId="1135054298729507" />
    <App />
  </StrictMode>,
);
