// .storybook/preview.tsx
import React from 'react';
import type { Preview } from '@storybook/react';
import '@mantine/core/styles.css';
import { MantineProvider, createTheme } from '@mantine/core';
const preview: Preview = {
  decorators: [
    (Story) => (
      <MantineProvider  defaultColorScheme="dark">
        <Story />
      </MantineProvider>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
