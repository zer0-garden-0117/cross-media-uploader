import { app } from 'electron';
import fs from 'fs';
import path from 'path';

export async function savePostData(postData: {
  date: string;
  comment: string;
  tags: string[];
}) {
  try {
    // 保存先ディレクトリ (例: ユーザーのホームディレクトリ配下)
    const saveDir = path.join(app.getPath('home'), 'scheduled-posts');
    
    // ディレクトリがなければ作成
    if (!fs.existsSync(saveDir)) {
      fs.mkdirSync(saveDir, { recursive: true });
    }

    // ファイル名 (例: タイムスタンプを使用)
    const filename = `post_${Date.now()}.json`;
    const filePath = path.join(saveDir, filename);

    // データをJSON形式で保存
    fs.writeFileSync(filePath, JSON.stringify(postData, null, 2));
    console.log(filePath)

    return { success: true, filePath };
  } catch (error) {
    console.error('Error saving post data:', error);
    return { success: false, error: error.message };
  }
}