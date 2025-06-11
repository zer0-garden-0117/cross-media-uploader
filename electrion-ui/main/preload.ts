import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  executeShellScript: (scriptPath: string) => ipcRenderer.invoke('execute-shell-script', scriptPath),
  saveTemporaryImages: (files: File[]) => ipcRenderer.invoke('save-temp-images', files),
  savePostData: (postData: {
    date: string;
    comment: string;
    tags: string[];
  }) => ipcRenderer.invoke('save-post-data', postData),
});