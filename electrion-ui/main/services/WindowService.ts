// src/main/services/WindowService.ts
import path from 'path';
import { BrowserWindow, app } from 'electron';
import serve from 'electron-serve';
import { createWindow } from '../helpers';

export class WindowService {
  private mainWindow: BrowserWindow | null = null;
  private readonly isProd: boolean;

  constructor() {
    this.isProd = process.env.NODE_ENV === 'production';
    this.setupProduction();
  }

  private setupProduction() {
    if (this.isProd) {
      serve({ directory: 'app' });
    } else {
      app.setPath('userData', `${app.getPath('userData')} (development)`);
    }
  }

  public async createMainWindow() {
    console.log('Creating main window...');
    console.log(`app.getAppPath(): ${app.getAppPath()}`);
    this.mainWindow = createWindow('main', {
      width: 1000,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
      },
    });

    await this.loadWindowContent();
    this.setupDevTools();
    return this.mainWindow;
  }

  private async loadWindowContent() {
    if (!this.mainWindow) return;

    if (this.isProd) {
      await this.mainWindow.loadURL('app://./home');
    } else {
      const port = process.argv[2];
      await this.mainWindow.loadURL(`http://localhost:${port}/home`);
    }
  }

  private setupDevTools() {
    if (!this.isProd && this.mainWindow) {
      this.mainWindow.webContents.openDevTools();
    }
  }

  public getMainWindow() {
    return this.mainWindow;
  }
}