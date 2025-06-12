import fs from 'fs';
import path from 'path';
import { app } from 'electron';
import * as cron from 'node-cron';
import { SavedPostData } from './PostService';

const POSTS_DIR = path.join(app.getPath('home'), 'scheduled-posts');
const IMAGES_DIR = path.join(POSTS_DIR, 'images');

export class PostScheduler {
  private timer: cron.ScheduledTask;

  constructor() {
    this.initializeDirectories();
    this.timer = cron.schedule('* * * * *', this.checkPosts.bind(this));
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

  private getPendingPosts(): SavedPostData[] {
    return fs.readdirSync(POSTS_DIR)
      .filter(file => file.endsWith('.json'))
      .map(file => {
        const data = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8');
        return JSON.parse(data) as SavedPostData;
      })
      .filter(post => post.status === 'pending');
  }

  private async processPost(post: SavedPostData) {
    try {
      // 1. 画像を読み込み
      // 2. API呼び出し
      // ToDo: ここに実際のAPI呼び出しロジックを実装

      // 3. ステータス更新
      this.updatePostStatus(post.id, 'posted');
      console.log(`投稿成功: ${post.id}`);

    } catch (error) {
      this.updatePostStatus(post.id, 'failed');
      console.error(`投稿失敗: ${post.id}`, error);
    }
  }

  private updatePostStatus(postId: string, status: 'posted' | 'failed') {
    const filePath = path.join(POSTS_DIR, `${postId}.json`);
    const post = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    post.status = status;
    fs.writeFileSync(filePath, JSON.stringify(post, null, 2));
  }
}