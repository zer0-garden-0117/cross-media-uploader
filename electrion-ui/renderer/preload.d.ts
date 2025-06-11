import { IpcHandler } from '../main/preload'

declare global {
  interface Window {
    ipc: IpcHandler,
    electronAPI: {
      executeShellScript: (scriptPath: string) => Promise<string>;
      savePostData: (postData: {
        date: string;
        comment: string;
        tags: string[];
      }) => Promise<{ success: boolean; filePath?: string; error?: string }>;
    };
  }
}
