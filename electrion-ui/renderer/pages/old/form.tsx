import React, { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import {
  Button,
  Flex,
  Paper,
  Space,
  Title,
} from '@mantine/core';
import { CustomDropzone } from '../../components/CustomDropzone';
import { CustomDateInput } from '../../components/CustomDateInput';
import { CustomTextInput } from '../../components/CustomTextInput';
import { CustomTagsInput } from '../../components/CustomTagsInput';

export default function FormPage() {
  const [dateValue, setDateValue] = useState<string>("");
  const [commentValue, setCommentValue] = useState<string>("");
  const [tagsValue, setTagsValue] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const handleDrop = async (newFiles: File[]) => {
    setFiles(prev => [...prev, ...newFiles]);
  };
  const handleRemove = async (index: number) => {    
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <React.Fragment>
      <Head>
        <title>Cross Media Uploader</title>
      </Head>
      <Paper radius="md" p="lg" withBorder>
        {/* 画像のD&D */}
        <Title>画像</Title>
        <CustomDropzone files={files} onDrop={handleDrop} onRemove={handleRemove}/>

        {/* 投稿日時 */}
        <Title>投稿日時</Title>
        <CustomDateInput value={dateValue} onChange={setDateValue} />

        {/* コメント */}
        <Title>コメント</Title>
        <CustomTextInput value={commentValue} onChange={setCommentValue} />

        {/* タグ */}
        <Title>タグ</Title>
        <CustomTagsInput value={tagsValue} onChange={setTagsValue} />

        <Space h="xl" />

        {/* 予約投稿ボタン */}
        <Flex justify="right" align="center">
        <Button
          size='xs'
        >
          予約投稿
        </Button>
        </Flex>

      </Paper>

      <div className="mt-1 w-full flex-wrap flex justify-center">
        <Link href="/script">Go to Script page</Link>
      </div>
    </React.Fragment>
  )
}
