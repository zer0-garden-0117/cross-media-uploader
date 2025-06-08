import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import {
  Anchor,
  Button,
  Checkbox,
  Divider,
  Group,
  Paper,
  PaperProps,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';

export default function NextPage() {

  return (
    <React.Fragment>
      <Head>
        <title>Next - Nextron (with-tailwindcss)</title>
      </Head>
      <Paper radius="md" p="lg" withBorder>
        <Text size="lg" fw={500}>
          Welcome to Mantine
        </Text>

        <Divider label="Or continue with email" labelPosition="center" my="lg" />

          <Stack>
            <TextInput
              required
              label="Email"
              placeholder="hello@mantine.dev"
              radius="md"
            />

            <PasswordInput
              required
              label="Password"
              placeholder="Your password"
              radius="md"
            />

          </Stack>

          <Group justify="space-between" mt="xl">
            <Anchor component="button" type="button" c="dimmed" size="xs">
            </Anchor>
            <Button type="submit" radius="xl">
            </Button>
          </Group>
      </Paper>

      <div className="mt-1 w-full flex-wrap flex justify-center">
        <Link href="/home">Go to home page</Link>
      </div>
    </React.Fragment>
  )
}
