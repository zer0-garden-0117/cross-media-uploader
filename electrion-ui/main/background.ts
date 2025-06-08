import path from 'path'
import { app, ipcMain } from 'electron'
import serve from 'electron-serve'
import { createWindow } from './helpers'
import { exec } from 'child_process';

const isProd = process.env.NODE_ENV === 'production'

if (isProd) {
  serve({ directory: 'app' })
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`)
}

;(async () => {
  await app.whenReady()

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  if (isProd) {
    await mainWindow.loadURL('app://./home')
  } else {
    const port = process.argv[2]
    await mainWindow.loadURL(`http://localhost:${port}/home`)
    mainWindow.webContents.openDevTools()
  }
})()

app.on('window-all-closed', () => {
  app.quit()
})

ipcMain.on('message', async (event, arg) => {
  event.reply('message', `${arg} World!`)
})

ipcMain.handle('execute-shell-script', async (event, scriptPath) => {
  return new Promise((resolve, reject) => {
    // スクリプトパスを絶対パスに変換（必要に応じて）
    const absolutePath = path.isAbsolute(scriptPath) 
      ? scriptPath 
      : path.join(app.getAppPath(), scriptPath);

    // 実行権限を付与（Linux/macOSの場合）
    if (process.platform !== 'win32') {
      exec(`chmod +x ${absolutePath}`, (error) => {
        if (error) {
          console.error('権限付与エラー:', error);
          return reject(error);
        }
      });
    }

    // スクリプトを実行
    exec(absolutePath, (error, stdout, stderr) => {
      if (error) {
        console.error('実行エラー:', error);
        return reject(error.message);
      }
      if (stderr) {
        console.error('stderr:', stderr);
        return reject(stderr);
      }
      resolve(stdout);
    });
  });
});