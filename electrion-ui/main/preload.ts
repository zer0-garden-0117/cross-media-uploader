import { contextBridge, ipcRenderer } from 'electron';
import { PostData } from '../post';

contextBridge.exposeInMainWorld('electronAPI', {
  executeShellScript: (scriptPath: string, args?: string[]) => ipcRenderer.invoke('execute-shell-script', scriptPath, args),
  savePostData: (postData: PostData) => ipcRenderer.invoke('save-post-data', postData),
  getPostDatas: () => ipcRenderer.invoke('get-post-datas'),
});