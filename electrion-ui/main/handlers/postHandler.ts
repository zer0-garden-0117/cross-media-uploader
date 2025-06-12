import { app } from 'electron';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

interface PostData {
  date: string;
  comment: string;
  imageData: ArrayBuffer;
  tags: string[];
}

export async function savePost(data: PostData) {
  const postId = uuidv4();
  const postDir = path.join(app.getPath('home'), 'scheduled-posts');
  const imagesDir = path.join(postDir, 'images');

  // ディレクトリ作成
  [postDir, imagesDir].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });

  try {
    // 画像保存処理
    const imageExt = '.png'; // 拡張子（必要に応じて変更可能）
    const imageFilename = `${postId}${imageExt}`;
    const imagePath = path.join(imagesDir, imageFilename);
    
    // ArrayBufferを画像ファイルとして保存
    fs.writeFileSync(imagePath, Buffer.from(data.imageData));

    // 投稿データ保存
    const postData = {
      id: postId,
      scheduledTime: data.date,
      comment: data.comment,
      image: imageFilename,
      tags: data.tags,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    fs.writeFileSync(
      path.join(postDir, `${postId}.json`),
      JSON.stringify(postData, null, 2)
    );

    return { success: true, postId };
  } catch (error) {
    console.error('投稿保存エラー:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}