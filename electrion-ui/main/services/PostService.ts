import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { POSTS_DIR, IMAGES_DIR } from '../config';
import { PostData, SavedPostData } from '../../post';

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
    const postId = uuidv4();

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

  public async getPostDatas(): Promise<SavedPostData[]> {
    return fs.readdirSync(POSTS_DIR)
      .filter(file => file.endsWith('.json'))
      .map(file => {
        const data = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8');
        return JSON.parse(data) as SavedPostData;
      })
      .filter(post => post.status === 'pending');
  }

  private async saveImage(postId: string, imageData: ArrayBuffer): Promise<string> {
    const imageExt = '.png';
    const imageFilename = `${postId}${imageExt}`;
    const imagePath = path.join(IMAGES_DIR, imageFilename);
    
    await fs.promises.writeFile(imagePath, Buffer.from(imageData));
    return imagePath;
  }

  private createPostData(postId: string, data: PostData, imagePath: string): SavedPostData {
    return {
      id: postId,
      scheduledTime: data.date,
      comment: data.comment,
      image: imagePath,
      tags: data.tags,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
  }

  private savePostData(postId: string, data: SavedPostData): void {
    fs.writeFileSync(
      path.join(POSTS_DIR, `${postId}.json`),
      JSON.stringify(data, null, 2)
    );
  }
}