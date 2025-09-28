import { createRoot } from 'react-dom/client'
import './index.css'
import '@mantine/core/styles.css'; // thêm để tránh conflix với cả tailwind
import '@mantine/carousel/styles.css';
import { MantineProvider } from '@mantine/core'
import { BrowserRouter } from "react-router-dom";
// import { Provider } from 'react-redux';
import Views from './routes/index.tsx';
createRoot(document.getElementById('root')!).render(
  <MantineProvider>
    <BrowserRouter>
        <Views />
    </BrowserRouter>
  </MantineProvider>
)

