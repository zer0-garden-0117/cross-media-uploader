import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import {
  Paper,
} from '@mantine/core';
import { CustomDropzone } from './components/CustomDropzone';

export default function NextPage() {

  return (
    <React.Fragment>
      <Head>
        <title>Next - Nextron (with-tailwindcss)</title>
      </Head>
      <Paper radius="md" p="lg" withBorder>
        {/* 画像のD&D */}
        <CustomDropzone />
      </Paper>

      <div className="mt-1 w-full flex-wrap flex justify-center">
        <Link href="/home">Go to home page</Link>
      </div>
    </React.Fragment>
  )
}
