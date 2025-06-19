import React, { useEffect, useState } from 'react'
import router from 'next/router';
import {
  Button,
  Flex,
  Paper,
  Space,
  Title,
} from '@mantine/core';
import { PostData } from '../../post';
import { CustomDropzone } from './CustomDropzone';
import { CustomDateInput } from './CustomDateInput';
import { CustomTextInput } from './CustomTextInput';
import { CustomTagsInput } from './CustomTagsInput';
import { CustomRadio } from './CustomRadio';
import { CustomCheckbox } from './CustomCheckbox';

interface PostFormProps {
  postId?: string;
}

export function PostForm({ postId }: PostFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [idValue, setIdValue] = useState<string>("");
  const [dateValue, setDateValue] = useState<string>("");
  const [commentValue, setCommentValue] = useState<string>("");
  const [genreValue, setGenreValue] = useState<string>("");
  const [characterValue, setCharacterValue] = useState<string>("");
  const [tagsValue, setTagsValue] = useState<string[]>([]);
  const [targetsValue, setTargetsValue] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const genreOptions = ["illustration", "icon"]
  const characterOptions = ["その他", "零崎真白", "零崎くるみ", "零崎鈴", "零崎蒼"]
  const targetOptions = ["ASB", "X", "Bluesky"]

  const handleDrop = async (newFiles: File[]) => {
    setFiles(prev => [...prev, ...newFiles]);
  };
  const handleRemove = async (index: number) => {    
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = (): boolean => {
    const missingFields = [];
    if (!dateValue) missingFields.push('投稿日時');
    if (!commentValue) missingFields.push('コメント');
    if (!genreValue) missingFields.push('ジャンル');
    if (!characterValue) missingFields.push('キャラクター');
    if (tagsValue.length === 0) missingFields.push('タグ');
    if (targetsValue.length === 0) missingFields.push('投稿先');
    if (files.length === 0) missingFields.push('画像');

    if (missingFields.length > 0) {
      alert(`${missingFields.join('、')}は必須です`);
      return false;
    }
    return true;
  };

  const handleSavePost = async () => {
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const imageDataArrayBuffer = await files[0].arrayBuffer()
      const postData: PostData = {
        id: idValue,
        scheduledTime: dateValue,
        comment: commentValue,
        imageData: imageDataArrayBuffer,
        genre: genreValue,
        character: characterValue,
        tags: tagsValue,
        targets: targetsValue
      };
      const result = await window.electronAPI.savePostData(postData);

      if (result.success) {
        alert('投稿が保存されました');
        router.push(`/postlist`);
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

  useEffect(() => {
    const fetchData = async () => {
      if (!postId) return;
      try {
        const result = await window.electronAPI.getPostData(postId);
        const postData: PostData = result.data;
        const imageBuffer: ArrayBuffer = result.imageBuffer;
        const file = new File([imageBuffer], postData.image || 'image.png');
        setDateValue(postData.scheduledTime)
        setCommentValue(postData.comment)
        setGenreValue(postData.genre)
        setCharacterValue(postData.character)
        setTagsValue(postData.tags)
        setTargetsValue(postData.targets)
        setFiles([file]);
        setIdValue(postId);
        setIsEditing(true);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [postId]);

  return (
    <Paper radius="md" p="lg" withBorder>
    {/* 画像のD&D */}
    <Title size="sx">画像</Title>
    <CustomDropzone files={files} onDrop={handleDrop} onRemove={handleRemove}/>

    {/* 投稿日時 */}
    <Title size="sx">投稿日時</Title>
    <CustomDateInput value={dateValue} onChange={setDateValue} />

    {/* コメント */}
    <Title size="sx">コメント</Title>
    <CustomTextInput value={commentValue} onChange={setCommentValue} />
  
    {/* ジャンル */}
    <Title size="sx">ジャンル</Title>
    <CustomRadio options={genreOptions} value={genreValue} onChange={setGenreValue} />

    {/* キャラクター */}
    <Title size="sx">キャラクター</Title>
    <CustomRadio options={characterOptions} value={characterValue} onChange={setCharacterValue} />

    {/* タグ */}
    <Title size="sx">タグ</Title>
    <CustomTagsInput value={tagsValue} onChange={setTagsValue} />

    {/* 投稿先 */}
    <Title size="sx">投稿先</Title>
    <CustomCheckbox options={targetOptions} value={targetsValue} onChange={setTargetsValue} />

    <Space h="xl" />

    {/* 予約投稿/編集ボタン */}
    <Flex justify="right" align="center">
    <Button
      size='xs'
      onClick={handleSavePost}
    >
      {isEditing ? '変更を保存' : '予約投稿'}
    </Button>
    </Flex>

    </Paper>
  );
}