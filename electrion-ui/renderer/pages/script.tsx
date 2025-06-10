import Link from 'next/link';
import React, { useState } from 'react';

const ScriptPage = () => {
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

  return (
    <React.Fragment>
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
      <div className="mt-1 w-full flex-wrap flex justify-center">
          <Link href="/home">Go to home page</Link>
      </div>
    </React.Fragment>
  );
};

export default ScriptPage;