import { createRoot } from 'react-dom/client'
import './index.css'
import '@mantine/core/styles.css'; // thêm để tránh conflix với cả tailwind
import '@mantine/carousel/styles.css';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { MantineProvider } from '@mantine/core'
import { BrowserRouter } from "react-router-dom";
// import { Provider } from 'react-redux';
import Views from './routes/index.tsx';
import { Notifications } from '@mantine/notifications';
createRoot(document.getElementById('root')!).render(
  <MantineProvider>
    <BrowserRouter>
      <Notifications />
      <Views />
    </BrowserRouter>
  </MantineProvider>
)

