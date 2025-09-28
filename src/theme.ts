import { createTheme, rem } from '@mantine/core';

export const theme = createTheme({
  /** Put your mantine theme override here */
  breakpoints: {
    xs: '30em', // 480 px
    sm: '48em', // 768 px
    md: '64em', // 1024 px
    lg: '74em', // 1184 px
    xl: '90em', // 1440 px
  },
  fontSizes: {
    xs: rem(12),
    sm: rem(13),
    md: rem(14),
    lg: rem(16),
    xl: rem(16),
  },
  lineHeights: {
    xs: rem(16),
    sm: rem(16),
    md: rem(20),
    lg: rem(24),
    xl: rem(24),
  },
  fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji',
});
