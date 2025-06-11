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
import { CustomDropzone } from '../components/CustomDropzone';
import { CustomDateInput } from '../components/CustomDateInput';
import { CustomTextInput } from '../components/CustomTextInput';
import { CustomTagsInput } from '../components/CustomTagsInput';

export default function StorePage() {
  const [dateValue, setDateValue] = useState<string>("");
  const [commentValue, setCommentValue] = useState<string>("");
  const [tagsValue, setTagsValue] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSavePost = async () => {
    if (!dateValue || !commentValue) {
      alert('投稿日時とコメントは必須です');
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await window.electronAPI.savePostData({
        date: dateValue,
        comment: commentValue,
        tags: tagsValue,
      });

      if (result.success) {
        alert('投稿が保存されました');
        // フォームをリセット
        setDateValue('');
        setCommentValue('');
        setTagsValue([]);
      } else {
        alert('保存に失敗しました');
      }
    } catch (error) {
      console.error(error);
      alert('エラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <React.Fragment>
      <Head>
        <title>Next - Nextron (with-tailwindcss)</title>
      </Head>
      <Paper radius="md" p="lg" withBorder>
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
          onClick={handleSavePost}
        >
          予約投稿
        </Button>
        </Flex>

      </Paper>

      <div className="mt-1 w-full flex-wrap flex justify-center">
        <Link href="/home">Go to Home page</Link>
      </div>
    </React.Fragment>
  )
}
