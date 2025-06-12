import { PostData, PostService } from '../services/PostService';

export async function savePost(data: PostData) {
  const postService = new PostService();
  return await postService.savePost(data);
}