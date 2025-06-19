import path from 'path';
import { app } from 'electron';

export const POSTS_DIR = path.join(app.getAppPath(), 'scheduled-posts');
export const IMAGES_DIR = path.join(POSTS_DIR, 'images');