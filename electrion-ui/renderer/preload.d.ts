import { IpcHandler } from '../main/preload'

declare global {
  interface Window {
    ipc: IpcHandler,
    electronAPI: {
      executeShellScript: (scriptPath: string) => Promise<string>;
    };
  }
}
