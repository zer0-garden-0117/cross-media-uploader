import React from 'react'
import type { AppProps } from 'next/app'
import { useDisclosure } from '@mantine/hooks';
import { AppShell, Burger, Group, Skeleton } from '@mantine/core';

import '../styles/globals.css'
import '@mantine/core/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/dates/styles.css';
import 'mantine-react-table/styles.css';
import { createTheme, MantineProvider } from '@mantine/core';
import { CustomNavbar } from '../components/CustomNavbar';

const theme = createTheme({
  /** Put your mantine theme override here */
});

function AppShellLayout({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      navbar={{ width: 50, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <CustomNavbar />
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider theme={theme}>
      <AppShellLayout>
        <Component {...pageProps} />
      </AppShellLayout>
    </MantineProvider>
  )
}

export default MyApp