import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  executeShellScript: (scriptPath: string, args?: string[]) => ipcRenderer.invoke('execute-shell-script', scriptPath, args),
  savePostData: (postData: {
    date: string;
    comment: string;
    imageData: ArrayBuffer;
    tags: string[];
  }) => ipcRenderer.invoke('save-post-data', postData),
});