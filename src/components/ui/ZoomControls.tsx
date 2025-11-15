import React from 'react';
import cytoscape from 'cytoscape';

interface ZoomControlsProps {
  cyInstance: cytoscape.Core | null;
}

export const ZoomControls: React.FC<ZoomControlsProps> = ({ cyInstance }) => {
  const handleZoomIn = (): void => {
    if (cyInstance) {
      cyInstance.zoom(cyInstance.zoom() * 1.2);
      cyInstance.center();
    }
  };

  const handleZoomOut = (): void => {
    if (cyInstance) {
      cyInstance.zoom(cyInstance.zoom() * 0.8);
      cyInstance.center();
    }
  };

  const handleFit = (): void => {
    if (cyInstance) {
      cyInstance.fit();
    }
  };

  return (
    <div style={{ 
      position: 'absolute', 
      top: '10px', 
      right: '10px', 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '8px',
      zIndex: 1000
    }}>
      <button onClick={handleZoomIn} style={buttonStyle}>+</button>
      <button onClick={handleZoomOut} style={buttonStyle}>-</button>
      <button onClick={handleFit} style={buttonStyle}>Fit</button>
    </div>
  );
};

const buttonStyle: React.CSSProperties = {
  width: '40px',
  height: '40px',
  fontSize: '18px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  backgroundColor: 'white',
  cursor: 'pointer',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
};