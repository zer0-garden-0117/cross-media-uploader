import { ShellService } from '../services/ShellService';

export const executeShellScript = async (scriptPath: string) => {
  return ShellService.executeScript(scriptPath);
};