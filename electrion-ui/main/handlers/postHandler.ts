import { app } from 'electron';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

interface PostData {
  scheduledTime: string;
  comment: string;
  images: string[]; // 画像ファイルの絶対パス配列
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
    // 画像保存（コピー）
    const savedImages = await Promise.all(
      data.images.map((imgPath, index) => {
        const ext = path.extname(imgPath);
        const filename = `${postId}_${index}${ext}`;
        const destPath = path.join(imagesDir, filename);
        fs.copyFileSync(imgPath, destPath);
        return filename;
      })
    );

    // 投稿データ保存
    const postData = {
      id: postId,
      scheduledTime: data.scheduledTime,
      comment: data.comment,
      images: savedImages,
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