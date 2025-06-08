import React, { useState } from 'react'
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

export default function FormPage() {
  const [dateValue, setDateValue] = useState<string>("");
  const [commentValue, setCommentValue] = useState<string>("");
  const [tagsValue, setTagsValue] = useState<string[]>([]);

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
        <CustomDateInput value={dateValue} onChange={setDateValue} />

        {/* コメント */}
        <Title>コメント</Title>
        <CustomTextInput value={commentValue} onChange={setCommentValue} />

        {/* タグ */}
        <Title>タグ</Title>
        <CustomTagsInput value={tagsValue} onChange={setTagsValue} />

      </Paper>

      <div className="mt-1 w-full flex-wrap flex justify-center">
        <Link href="/script">Go to Script page</Link>
      </div>
    </React.Fragment>
  )
}
