import React, { useEffect, useRef } from 'react';
import cytoscape, { Core, EdgeSingular, NodeSingular } from 'cytoscape';
import dagre from 'cytoscape-dagre';
import { useGraphStore } from '../../store/graphStore';
import { transformToCytoscapeElements } from '../../utils/graphTransform';

// Register dagre layout
cytoscape.use(dagre);

interface CytoscapeGraphProps {
  layoutName?: string;
  width?: string;
  height?: string;
}

/**
 * Main Cytoscape.js graph visualization component
 * Uses dagre layout for hierarchical AV signal flow visualization
 */
export const CytoscapeGraph: React.FC<CytoscapeGraphProps> = ({
  layoutName = 'dagre',
  width = '100%',
  height = '800px'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);
  const { graph, selectNode, selectEdge, setZoomLevel } = useGraphStore();
  
  useEffect(() => {
    if (!containerRef.current || !graph) return;
    
    try {
      const cy = cytoscape({
        container: containerRef.current,
        elements: transformToCytoscapeElements(graph),
        style: [
          // Base node style - rectangular for AV equipment look
          {
            selector: 'node.node',
            style: {
              'background-color': '#0074D9',
              label: 'data(label)',
              'text-valign': 'center',
              'text-halign': 'center',
              width: 120,
              height: 60,
              'font-size': 11,
              'font-weight': '600',
              'text-wrap': 'wrap',
              'text-max-width': '110px',
              shape: 'rectangle',
              'border-width': 3,
              'border-color': '#003366',
              color: '#ffffff'
            }
          },
          // Category-based node colors
          {
            selector: 'node.node-Video',
            style: {
              'background-color': '#0074D9',
              'border-color': '#003d82'
            }
          },
          {
            selector: 'node.node-Audio',
            style: {
              'background-color': '#B10DC9',
              'border-color': '#7b0a8f'
            }
          },
          {
            selector: 'node.node-Network',
            style: {
              'background-color': '#39CCCC',
              'border-color': '#2a9999'
            }
          },
          // Status-based styling overlay
          {
            selector: 'node.status-Existing',
            style: {
              'background-color': '#2ECC40',
              'border-color': '#1f8c2b'
            }
          },
          {
            selector: 'node.status-Defect',
            style: {
              'background-color': '#FF4136',
              'border-color': '#cc1f17',
              'border-style': 'dashed'
            }
          },
          // Area styling (compound nodes for grouping)
          {
            selector: 'node.area',
            style: {
              'background-color': '#f0f0f0',
              'background-opacity': 0.2,
              'border-width': 2,
              'border-color': '#999',
              'border-style': 'dashed',
              shape: 'rectangle',
              'font-size': 14,
              'font-weight': 'bold',
              'text-valign': 'top',
              'text-halign': 'center',
              'text-margin-y': 10,
              color: '#666',
              'padding': 30
            }
          },
          // Edge styling - orthogonal (taxi) for AV schematic look
          {
            selector: 'edge',
            style: {
              width: 3,
              'line-color': '#888',
              'target-arrow-color': '#888',
              'target-arrow-shape': 'triangle',
              'curve-style': 'taxi', // Orthogonal edges!
              'taxi-direction': 'auto',
              'taxi-turn': 50,
              'taxi-turn-min-distance': 10,
              label: 'data(label)',
              'font-size': 9,
              'text-rotation': 'none',
              'text-margin-y': -10,
              'text-background-color': '#fff',
              'text-background-opacity': 0.9,
              'text-background-padding': '3px',
              'text-background-shape': 'roundrectangle'
            }
          },
          // Category-based edge colors
          {
            selector: 'edge.edge-Video',
            style: {
              'line-color': '#0074D9',
              'target-arrow-color': '#0074D9',
              width: 4
            }
          },
          {
            selector: 'edge.edge-Audio',
            style: {
              'line-color': '#B10DC9',
              'target-arrow-color': '#B10DC9',
              width: 4
            }
          },
          {
            selector: 'edge.edge-Network',
            style: {
              'line-color': '#39CCCC',
              'target-arrow-color': '#39CCCC',
              width: 4
            }
          },
          // Selection styling
          {
            selector: ':selected',
            style: {
              'background-color': '#FF851B',
              'line-color': '#FF851B',
              'target-arrow-color': '#FF851B',
              'border-width': 4,
              'border-color': '#FF851B',
              'border-style': 'solid'
            }
          }
        ],
        layout: {
          name: layoutName,
          // Dagre-specific options for AV signal flow
          rankDir: 'LR', // Left to Right signal flow
          nodeSep: 80, // Horizontal spacing between nodes
          edgeSep: 40, // Spacing between edges
          rankSep: 150, // Vertical spacing between ranks/layers
          padding: 50,
          animate: false, // Disable animation to prevent cleanup errors
          fit: true,
          spacingFactor: 1.2
        }
      });
      
      cyRef.current = cy;
      
      // Event handlers
      cy.on('tap', 'node.node', (evt) => {
        const node: NodeSingular = evt.target;
        selectNode(node.id());
      });
      
      cy.on('tap', 'edge', (evt) => {
        const edge: EdgeSingular = evt.target;
        selectEdge(edge.id());
      });
      
      // Zoom event handler
      cy.on('zoom', () => {
        setZoomLevel(cy.zoom());
      });
      
      // Clear selection on background tap
      cy.on('tap', (evt) => {
        if (evt.target === cy) {
          selectNode(null);
          selectEdge(null);
        }
      });
      
      // Cleanup function
      return () => {
        if (cyRef.current) {
          cyRef.current.destroy();
          cyRef.current = null;
        }
      };
    } catch (error) {
      console.error('Error initializing Cytoscape:', error);
    }
  }, [graph, layoutName, selectNode, selectEdge, setZoomLevel]);
  
  return (
    <div 
      ref={containerRef} 
      style={{ 
        width, 
        height,
        border: '1px solid #ccc',
        borderRadius: '4px',
        backgroundColor: '#fafafa'
      }} 
    />
  );
};
