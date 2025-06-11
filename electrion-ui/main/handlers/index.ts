// handlers/index.ts
import { ipcMain } from 'electron';
import * as shellHandler from './shellHandler';
import * as postHandler from './postHandler';
import * as imageHandler from './imageHandler';

const handlers: { [key: string]: (...args: any[]) => any } = {
  'execute-shell-script': shellHandler.executeShellScript,
  'save-temp-images': imageHandler.registerImageHandlers,
  'save-post-data': postHandler.savePost,
};

export function registerHandlers() {
  Object.entries(handlers).forEach(([channel, handler]) => {
    ipcMain.handle(channel, async (event, ...args) => {
      return handler(...args);
    });
  });
}