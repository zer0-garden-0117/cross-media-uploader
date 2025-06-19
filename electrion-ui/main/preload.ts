import { contextBridge, ipcRenderer } from 'electron';
import { PostData } from '../shared/interface/post';

contextBridge.exposeInMainWorld('electronAPI', {
  executeShellScript: (scriptPath: string, args?: string[]) => ipcRenderer.invoke('execute-shell-script', scriptPath, args),
  savePostData: (postData: PostData) => ipcRenderer.invoke('save-post-data', postData),
  editPostData: (postId: string, postData: PostData) => ipcRenderer.invoke('edit-post-data', postId, postData),
  deletePostData: (postId: string) => ipcRenderer.invoke('delete-post-data', postId),
  getPostDatas: () => ipcRenderer.invoke('get-post-datas'),
  getPostData: (postId: string) => ipcRenderer.invoke('get-post-data', postId),
});