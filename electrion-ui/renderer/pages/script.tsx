import Link from 'next/link';
import React from 'react';
import { useScriptExecutor } from '../hooks/useScriptExecutor';

const ScriptPage = () => {
  const { runScript, output, isLoading, error } = useScriptExecutor();

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
          <Link href="/store">Go to Store page</Link>
      </div>
    </React.Fragment>
  );
};

export default ScriptPage;