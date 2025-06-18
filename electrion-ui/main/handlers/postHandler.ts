import { PostData } from '../../post';
import { PostService } from '../services/PostService';

export async function savePost(data: PostData) {
  const postService = new PostService();
  return await postService.savePost(data);
}

export async function editPost(postId: string, data: PostData) {
  const postService = new PostService();
  return await postService.editPost(postId, data);
}

export async function deletePost(postId: string) {
  const postService = new PostService();
  return await postService.deletePost(postId);
}

export async function getPostDatas() {
  const postService = new PostService();
  return await postService.getPostDatas();
}

export async function getPostData(postId: string) {
  const postService = new PostService();
  return await postService.getPostData(postId);
}