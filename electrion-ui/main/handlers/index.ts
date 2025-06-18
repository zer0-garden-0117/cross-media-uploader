// handlers/index.ts
import { ipcMain } from 'electron';
import * as shellHandler from './shellHandler';
import * as postHandler from './postHandler';

const handlers: { [key: string]: (...args: any[]) => any } = {
  'execute-shell-script': shellHandler.executeShellScript,
  'save-post-data': postHandler.savePost,
  'edit-post-data': postHandler.editPost,
  'delete-post-data': postHandler.deletePost,
  'get-post-datas': postHandler.getPostDatas,
};

export function registerHandlers() {
  Object.entries(handlers).forEach(([channel, handler]) => {
    ipcMain.handle(channel, async (event, ...args) => {
      return handler(...args);
    });
  });
}