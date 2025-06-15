import { IpcHandler } from '../main/preload'
import { PostData, SavedPostData } from '../post'

declare global {
  interface Window {
    ipc: IpcHandler,
    electronAPI: {
      executeShellScript: (scriptPath: string, args?: string[]) => Promise<string>,
      saveTemporaryImages: (files: File[]) => Promise<string[]>,
      savePostData: (postData: PostData) => Promise<{ success: boolean; filePath?: string; error?: string }>;
      getPostDatas: () => Promise<SavedPostData[]> 
    };
  }
}
