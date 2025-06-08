import React, { useState } from 'react';

const ScriptRunner = () => {
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const runScript = async () => {
    setIsLoading(true);
    setError('');
    try {
      // スクリプトのパスを指定（publicディレクトリなどに配置）
      const scriptPath = 'scripts/example.sh';
      const result = await window.electronAPI.executeShellScript(scriptPath);
      setOutput(result as string);
    } catch (err) {
    //   setError(err as string);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>シェルスクリプト実行</h1>
      <button onClick={runScript} disabled={isLoading}>
        {isLoading ? '実行中...' : 'スクリプトを実行'}
      </button>
      
      {error && <div style={{ color: 'red' }}>エラー: {error}</div>}
      
      {output && (
        <div>
          <h3>出力結果:</h3>
          <pre>{output}</pre>
        </div>
      )}
    </div>
  );
};

export default ScriptRunner;