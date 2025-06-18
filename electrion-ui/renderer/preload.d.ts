import { IpcHandler } from '../main/preload'
import { PostData, SavedPostData } from '../post'

declare global {
  interface Window {
    ipc: IpcHandler,
    electronAPI: {
      executeShellScript: (scriptPath: string, args?: string[]) => Promise<string>,
      saveTemporaryImages: (files: File[]) => Promise<string[]>,
      savePostData: (postData: PostData) => Promise<{ success: boolean; filePath?: string; error?: string }>;
      editPostData: (postId: string, postData: PostData) => Promise<{ success: boolean; error?: string }>;
      deletePostData: (postId: string) => Promise<{ success: boolean; error?: string }>;
      getPostDatas: () => Promise<SavedPostData[]>;
      getPostData: (postId: string) => Promise<{ data:SavedPostData; imageBuffer: ArrayBuffer }>; 
    };
  }
}
