import { ShellService } from '../services/ShellService';

export const executeShellScript = async (scriptPath: string, args?: string[]) => {
  return ShellService.executeScript(scriptPath, args);
};