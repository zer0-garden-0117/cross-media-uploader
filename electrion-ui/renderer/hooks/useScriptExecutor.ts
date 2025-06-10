import { useState } from 'react';

export const useScriptExecutor = () => {
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const runScript = async () => {
    setIsLoading(true);
    setError('');
    try {
      const scriptPath = 'scripts/example.sh';
      const result = await window.electronAPI.executeShellScript(scriptPath);
      setOutput(result as string);
    } catch (err) {
      setError(err as string);
    } finally {
      setIsLoading(false);
    }
  };

  return { runScript, output, isLoading, error };
};