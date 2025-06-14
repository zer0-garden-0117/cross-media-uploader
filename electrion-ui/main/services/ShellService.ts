import { exec } from 'child_process';
import path from 'path';
import { app } from 'electron';

export class ShellService {
  /**
   * シェルスクリプトを実行する
   * @param scriptPath スクリプトのパス
   * @param args スクリプトに渡す引数の配列
   * @returns 実行結果の標準出力
   */
  public static async executeScript(scriptPath: string, args: string[] = []): Promise<string> {
    const absolutePath = this.resolveAbsolutePath(scriptPath);
    await this.ensureExecutable(absolutePath);
    return this.execute(absolutePath, args);
  }

  /**
   * 絶対パスに変換
   */
  private static resolveAbsolutePath(scriptPath: string): string {
    return path.isAbsolute(scriptPath) 
      ? scriptPath 
      : path.join(app.getAppPath(), scriptPath);
  }

  /**
   * 実行権限を付与（Linux/macOSのみ）
   */
  private static async ensureExecutable(path: string): Promise<void> {
    if (process.platform === 'win32') return;

    return new Promise((resolve, reject) => {
      exec(`chmod +x ${path}`, (error) => {
        error ? reject(error) : resolve();
      });
    });
  }

  /**
   * 実際の実行処理
   * @param absolutePath スクリプトの絶対パス
   * @param args スクリプトに渡す引数の配列
   */
  private static async execute(absolutePath: string, args: string[] = []): Promise<string> {
    // 引数を適切にエスケープしてコマンドラインに渡す
    const escapedArgs = args.map(arg => `"${arg.replace(/"/g, '\\"')}"`).join(' ');
    const command = `${absolutePath} ${escapedArgs}`;

    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) return reject(error.message);
        if (stderr) return reject(stderr);
        resolve(stdout);
      });
    });
  }
}