import React, { useState } from 'react';
import { CytoscapeGraph } from './components/graph/CytoscapeGraph';
import { FilterPanel } from './components/ui/FilterPanel';
import { useGraphStore } from './store/graphStore';
import { validateAVWiringGraph } from './utils/validation';
import { AVWiringGraph } from './types/graph.types';

function App(): JSX.Element {
  const { loadGraph, graph } = useGraphStore();
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        
        if (validateAVWiringGraph(data)) {
          loadGraph(data as AVWiringGraph);
          setError(null);
        } else {
          setError('Invalid graph data format');
        }
      } catch (err) {
        setError(`Error loading file: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <header style={{
        padding: '16px',
        backgroundColor: '#f5f5f5',
        borderBottom: '1px solid #ddd'
      }}>
        <h1 style={{ margin: '0 0 12px 0', fontSize: '24px' }}>AVFlowView</h1>
        <input
          type="file"
          accept=".json"
          onChange={handleFileUpload}
          style={{ marginBottom: '8px' }}
        />
        {error && (
          <div style={{ color: 'red', fontSize: '14px', marginTop: '8px' }}>
            {error}
          </div>
        )}
      </header>
      
      <div style={{ 
        position: 'relative', 
        width: '100%', 
        height: 'calc(100vh - 100px)' 
      }}>
        {graph ? (
          <>
            <FilterPanel />
            <CytoscapeGraph layoutName="cose" />
          </>
        ) : (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: '#666'
          }}>
            Upload a graph JSON file to visualize
          </div>
        )}
      </div>
    </div>
  );
}

export default App;