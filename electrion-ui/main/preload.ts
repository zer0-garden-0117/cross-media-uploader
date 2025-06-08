import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  executeShellScript: (scriptPath: string) => ipcRenderer.invoke('execute-shell-script', scriptPath),
  // 他のAPIもここに追加可能
});