import { IpcHandler } from '../main/preload'

declare global {
  interface Window {
    ipc: IpcHandler,
    electronAPI: {
      executeShellScript: (scriptPath: string) => Promise<string>;
      saveTemporaryImages: (files: File[]) => Promise<string[]>,
      savePostData: (postData: {
        date: string;
        comment: string;
        imageData: ArrayBuffer;
        tags: string[];
      }) => Promise<{ success: boolean; filePath?: string; error?: string }>;
    };
  }
}
