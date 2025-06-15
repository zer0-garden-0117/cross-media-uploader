import { PostData } from '../../post';
import { PostService } from '../services/PostService';

export async function savePost(data: PostData) {
  const postService = new PostService();
  return await postService.savePost(data);
}

export async function getPostDatas() {
  const postService = new PostService();
  return await postService.getPostDatas();
}