import React, { useEffect, useRef } from 'react';
import cytoscape, { Core, EdgeSingular, NodeSingular } from 'cytoscape';
import { useGraphStore } from '../../store/graphStore';
import { transformToCytoscapeElements } from '../../utils/graphTransform';

interface CytoscapeGraphProps {
  layoutName?: string;
  width?: string;
  height?: string;
}

/**
 * Main Cytoscape.js graph visualization component
 */
export const CytoscapeGraph: React.FC<CytoscapeGraphProps> = ({
  layoutName = 'cose',
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
          // Base node style
          {
            selector: 'node.node',
            style: {
              'background-color': '#0074D9',
              label: 'data(label)',
              'text-valign': 'center',
              'text-halign': 'center',
              width: 100,
              height: 80,
              'font-size': 11,
              'text-wrap': 'wrap',
              'text-max-width': '90px',
              shape: 'roundrectangle',
              'border-width': 2,
              'border-color': '#003366'
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
          // Status-based styling (overlay on category colors)
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
          // Area styling (compound nodes)
          {
            selector: 'node.area',
            style: {
              'background-color': '#f0f0f0',
              'background-opacity': 0.3,
              'border-width': 2,
              'border-color': '#999',
              'border-style': 'dotted',
              shape: 'roundrectangle',
              'font-size': 14,
              'font-weight': 'bold',
              'text-valign': 'top',
              'text-halign': 'center',
              'padding': 20
            }
          },
          // Edge styling by category
          {
            selector: 'edge',
            style: {
              width: 3,
              'line-color': '#888',
              'target-arrow-color': '#888',
              'target-arrow-shape': 'triangle',
              'curve-style': 'bezier',
              label: 'data(label)',
              'font-size': 9,
              'text-rotation': 'autorotate',
              'text-background-color': '#fff',
              'text-background-opacity': 0.8,
              'text-background-padding': '3px'
            }
          },
          {
            selector: 'edge.edge-Video',
            style: {
              'line-color': '#0074D9',
              'target-arrow-color': '#0074D9'
            }
          },
          {
            selector: 'edge.edge-Audio',
            style: {
              'line-color': '#B10DC9',
              'target-arrow-color': '#B10DC9'
            }
          },
          {
            selector: 'edge.edge-Network',
            style: {
              'line-color': '#39CCCC',
              'target-arrow-color': '#39CCCC'
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
          padding: 50,
          animate: true,
          animationDuration: 500
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
      
      return () => {
        cy.destroy();
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
