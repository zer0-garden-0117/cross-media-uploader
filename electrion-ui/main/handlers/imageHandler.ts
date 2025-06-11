import fs from 'fs';
import path from 'path';
import { app, ipcMain } from 'electron';

export async function registerImageHandlers(files: File[]) {
    const tempDir = path.join(app.getPath('temp'), 'your-app-images');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

    const savedPaths: string[] = [];
    
    for (const file of files) {
      const tempPath = path.join(tempDir, `${Date.now()}_${file.name}`);
      const buffer = await file.arrayBuffer();
      fs.writeFileSync(tempPath, Buffer.from(buffer));
      savedPaths.push(tempPath);
    }
    
    return savedPaths;
}