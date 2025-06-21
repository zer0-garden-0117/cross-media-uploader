import fs from 'fs';
import path from 'path';
import * as cron from 'node-cron';
import { PostData } from '../../shared/interface/post';
import { POSTS_DIR, IMAGES_DIR } from '../config';
import { ShellService } from './ShellService';
import { TargetType } from '../../shared/types/target';
import { StatusType } from '../../shared/types/status';

export class SchedulerService {
  private timer: cron.ScheduledTask;

  public startSchedulerPost() {
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
    console.log('スケジューラが実行されました。');
    try {
      const now = new Date();
      const jstOffset = 9 * 60 * 60 * 1000;
      const jstTime = new Date(now.getTime() + jstOffset);
      const jstString = jstTime.toISOString().replace('Z', '');

      const posts = this.getPendingPosts();

      for (const post of posts) {
        console.log(`チェック中: ${post.id}, スケジュール時間: ${post.scheduledTime}, 現在時間: ${jstString}`);
        console.log(post.scheduledTime <= jstString ? '投稿可能' : '投稿不可');
        if (post.scheduledTime <= jstString && post.status === StatusType.PENDING) {
          post.targets.forEach(target => {
            if (target === TargetType.ASB) {
              this.processPostToASB(post);
            } else if (target === TargetType.X) {
              this.processPostToX(post);
            } else if (target === TargetType.BLUESKY) {
              this.processPostToBS(post);
            }
          });
        }
      }
    } catch (error) {
      console.error('スケジューラエラー:', error);
    }
  }

  private getPendingPosts(): PostData[] {
    return fs.readdirSync(POSTS_DIR)
      .filter(file => file.endsWith('.json'))
      .map(file => {
        const data = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8');
        return JSON.parse(data) as PostData;
      })
      .filter(post => post.status === StatusType.PENDING);
  }

  private async processPostToASB(post: PostData) {
    try {
      const scriptPath = 'scripts/asb-uploader.sh';
      const tagsString = post.tags.join(',');
      const args = [
        post.image,             // 画像パス
        post.comment,           // コメント
        'zer0',                 // 作者
        post.character,         // キャラクター
        post.genre,             // ジャンル
        tagsString              // タグ
      ];
      await ShellService.executeScript(scriptPath, args);

      this.updatePostStatus(post.id, StatusType.POSTED);
      console.log(`投稿成功: ${post.id}`);

    } catch (error) {
      this.updatePostStatus(post.id, StatusType.FAILED);
      console.error(`投稿失敗: ${post.id}`, error);
    }
  }

  private async processPostToX(post: PostData) {
    try {
      const scriptPath = 'scripts/x-uploader.sh';
      const args = [
        post.image,             // 画像パス
        post.comment,           // コメント
      ];
      await ShellService.executeScript(scriptPath, args);

      this.updatePostStatus(post.id, StatusType.POSTED);
      console.log(`投稿成功: ${post.id}`);

    } catch (error) {
      this.updatePostStatus(post.id, StatusType.FAILED);
      console.error(`投稿失敗: ${post.id}`, error);
    }
  }

  private async processPostToBS(post: PostData) {
    try {
      const scriptPath = 'scripts/bs-uploader.sh';
      const args = [
        post.comment,           // コメント
        post.image,             // 画像パス
      ];
      await ShellService.executeScript(scriptPath, args);

      this.updatePostStatus(post.id, StatusType.POSTED);
      console.log(`投稿成功: ${post.id}`);

    } catch (error) {
      this.updatePostStatus(post.id, StatusType.FAILED);
      console.error(`投稿失敗: ${post.id}`, error);
    }
  }

  private updatePostStatus(postId: string, status: StatusType) {
    const filePath = path.join(POSTS_DIR, `${postId}.json`);
    const post = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    post.status = status;
    fs.writeFileSync(filePath, JSON.stringify(post, null, 2));
  }
}