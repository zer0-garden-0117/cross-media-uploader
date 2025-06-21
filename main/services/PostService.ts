import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { POSTS_DIR, IMAGES_DIR } from '../config';
import { PostData } from '../../shared/interface/post';
import { StatusType } from '../../shared/types/status';

export class PostService {
  constructor() {
    this.ensureDirectoriesExist();
  }

  private ensureDirectoriesExist(): void {
    [POSTS_DIR, IMAGES_DIR].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  public async savePost(data: PostData): Promise<{ success: boolean; postId?: string; error?: string }> {
    const postId = data.id === '' ? uuidv4() : data.id;

    try {
      const imagePath = await this.saveImage(postId, data.imageData);
      const postData = this.createPostData(postId, data, imagePath);
      
      this.savePostData(postId, postData);

      return { success: true, postId };
    } catch (error) {
      console.error('投稿保存エラー:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  public async editPost(postId: string, data: PostData): Promise<{ success: boolean; error?: string }> {
    try {
      // 既存の投稿データを取得
      const postFilePath = path.join(POSTS_DIR, `${postId}.json`);
      if (!fs.existsSync(postFilePath)) {
        throw new Error('投稿が見つかりません');
      }

      // 画像を更新
      const imagePath = await this.saveImage(postId, data.imageData);
      
      // 新しい投稿データを作成
      const postData = this.createPostData(postId, data, imagePath);
      
      // 投稿データを更新
      this.savePostData(postId, postData);

      return { success: true };
    } catch (error) {
      console.error('投稿編集エラー:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  public async deletePost(postId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // 投稿データファイルのパス
      const postFilePath = path.join(POSTS_DIR, `${postId}.json`);
      
      // 画像ファイルのパスを取得
      const postData = JSON.parse(fs.readFileSync(postFilePath, 'utf-8')) as PostData;
      const imagePath = postData.image;

      // 投稿データを削除
      fs.unlinkSync(postFilePath);

      // 画像ファイルが存在すれば削除
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

      return { success: true };
    } catch (error) {
      console.error('投稿削除エラー:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  public async getPostDatas(): Promise<PostData[]> {
    return fs.readdirSync(POSTS_DIR)
      .filter(file => file.endsWith('.json'))
      .map(file => {
        const data = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8');
        return JSON.parse(data) as PostData;
      })
      .filter(post => post.status === StatusType.PENDING);
  }

 public async getPostData(postId: string): Promise<{ data: PostData; imageBuffer: ArrayBuffer }> {
    try {
        const postFilePath = path.join(POSTS_DIR, `${postId}.json`);
        if (!fs.existsSync(postFilePath)) {
            throw new Error('投稿が見つかりません');
        }

        const data = fs.readFileSync(postFilePath, 'utf-8');
        const postData = JSON.parse(data) as PostData;
        let imageBuffer: ArrayBuffer | undefined;
        let imageMimeType: string | undefined;
        if (postData.image && fs.existsSync(postData.image)) {
            const imageFileBuffer = fs.readFileSync(postData.image);
            imageBuffer = imageFileBuffer.buffer.slice(
                imageFileBuffer.byteOffset,
                imageFileBuffer.byteOffset + imageFileBuffer.byteLength
            );
        }
        return { data: postData, imageBuffer: imageBuffer };
    } catch (error) {
        console.error('投稿データ取得エラー:', error);
        throw error;
    }
}

  private async saveImage(postId: string, imageData: ArrayBuffer): Promise<string> {
    const imageExt = '.png';
    const imageFilename = `${postId}${imageExt}`;
    const imagePath = path.join(IMAGES_DIR, imageFilename);
    
    await fs.promises.writeFile(imagePath, Buffer.from(imageData));
    return imagePath;
  }

  private createPostData(postId: string, data: PostData, imagePath: string): PostData {
    return {
      id: postId,
      image: imagePath,
      status: StatusType.PENDING,
      scheduledTime: data.scheduledTime,
      comment: data.comment,
      tags: data.tags,
      character: data.character,
      genre: data.genre,
      targets: data.targets,
      createdAt: new Date().toISOString()
    };
  }

  private savePostData(postId: string, data: PostData): void {
    fs.writeFileSync(
      path.join(POSTS_DIR, `${postId}.json`),
      JSON.stringify(data, null, 2)
    );
  }
}