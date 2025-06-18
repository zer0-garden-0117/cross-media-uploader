import React, { useEffect, useState } from 'react'
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
import { PostData } from '../../post';

interface PostFormProps {
  postId?: string;
}

export function PostForm({ postId }: PostFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  console.log(postId)
  useEffect(() => {
    const fetchData = async () => {
      if (!postId) return;
      try {
        const postData = await window.electronAPI.getPostData(postId);
        setDateValue(postData.createdAt)
        setCommentValue(postData.comment)
        setTagsValue(postData.tags)
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [postId]);

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

  const handleSavePost = async () => {
    if (!dateValue || !commentValue) {
      alert('投稿日時とコメントは必須です');
      return;
    }

    setIsLoading(true);
    
    try {
      const imageDataArrayBuffer = await files[0].arrayBuffer()
      const postData: PostData = {
        date: dateValue,
        comment: commentValue,
        imageData: imageDataArrayBuffer,
        tags: tagsValue
      };
      const result = await window.electronAPI.savePostData(postData);

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

    {/* 予約投稿/編集ボタン */}
    <Flex justify="right" align="center">
    <Button
      size='xs'
      onClick={handleSavePost}
    >
        予約投稿
    </Button>
    </Flex>

    </Paper>
  );
}