import fs from 'fs';
import path from 'path';
import { app } from 'electron';
import cron from 'node-cron';

const POSTS_DIR = path.join(app.getPath('home'), 'scheduled-posts');
const IMAGES_DIR = path.join(POSTS_DIR, 'images');

interface ScheduledPost {
  id: string;
  scheduledTime: string;
  comment: string;
  images: string[];
  tags: string[];
  status: 'pending' | 'posted' | 'failed';
}

export class PostScheduler {
  private timer: cron.ScheduledTask;

  constructor() {
    this.initializeDirectories();
    this.timer = cron.schedule('* * * * *', this.checkPosts.bind(this)); // 毎分実行
  }

  private initializeDirectories() {
    if (!fs.existsSync(POSTS_DIR)) {
      fs.mkdirSync(POSTS_DIR, { recursive: true });
    }
    if (!fs.existsSync(IMAGES_DIR)) {
      fs.mkdirSync(IMAGES_DIR, { recursive: true });
    }
  }

  private async checkPosts() {
    try {
      const now = new Date().toISOString();
      const posts = this.getPendingPosts();

      for (const post of posts) {
        if (post.scheduledTime <= now && post.status === 'pending') {
          await this.processPost(post);
        }
      }
    } catch (error) {
      console.error('スケジューラエラー:', error);
    }
  }

  private getPendingPosts(): ScheduledPost[] {
    return fs.readdirSync(POSTS_DIR)
      .filter(file => file.endsWith('.json'))
      .map(file => {
        const data = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8');
        return JSON.parse(data) as ScheduledPost;
      })
      .filter(post => post.status === 'pending');
  }

  private async processPost(post: ScheduledPost) {
    try {
      // 1. 画像を読み込み
      const images = post.images.map(img => ({
        name: img,
        data: fs.readFileSync(path.join(IMAGES_DIR, img))
      }));

      // 2. API呼び出し
      const result = await this.callPostAPI({
        comment: post.comment,
        images: images,
        tags: post.tags
      });

      // 3. ステータス更新
      this.updatePostStatus(post.id, 'posted');
      console.log(`投稿成功: ${post.id}`);

    } catch (error) {
      this.updatePostStatus(post.id, 'failed');
      console.error(`投稿失敗: ${post.id}`, error);
    }
  }

  private async callPostAPI(data: any) {
    // 実際のAPI呼び出し実装
    // 例: fetchやaxiosを使用
  }

  private updatePostStatus(postId: string, status: 'posted' | 'failed') {
    const filePath = path.join(POSTS_DIR, `${postId}.json`);
    const post = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    post.status = status;
    fs.writeFileSync(filePath, JSON.stringify(post, null, 2));
  }
}