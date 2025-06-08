import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import {
  Paper,
  Title,
} from '@mantine/core';
import { CustomDropzone } from '../components/CustomDropzone';
import { CustomDateInput } from '../components/CustomDateInput';
import { CustomTextInput } from '../components/CustomTextInput';
import { CustomTagsInput } from '../components/CustomTagsInput';

export default function NextPage() {

  return (
    <React.Fragment>
      <Head>
        <title>Next - Nextron (with-tailwindcss)</title>
      </Head>
      <Paper radius="md" p="lg" withBorder>
        {/* 画像のD&D */}
        <Title>画像</Title>
        <CustomDropzone />

        {/* 投稿日時 */}
        <Title>投稿日時</Title>
        <CustomDateInput />

        {/* コメント */}
        <Title>コメント</Title>
        <CustomTextInput />

        {/* タグ */}
        <Title>タグ</Title>
        <CustomTagsInput />

      </Paper>

      <div className="mt-1 w-full flex-wrap flex justify-center">
        <Link href="/home">Go to home page</Link>
      </div>
    </React.Fragment>
  )
}
