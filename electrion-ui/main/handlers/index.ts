// handlers/index.ts
import { ipcMain } from 'electron';
import * as shellHandler from './shellHandler';

const handlers: { [key: string]: (...args: any[]) => any } = {
  'execute-shell-script': shellHandler.executeShellScript,
  // 他のハンドラ...
};

export function registerHandlers() {
  Object.entries(handlers).forEach(([channel, handler]) => {
    ipcMain.handle(channel, async (event, ...args) => {
      return handler(...args);
    });
  });
}