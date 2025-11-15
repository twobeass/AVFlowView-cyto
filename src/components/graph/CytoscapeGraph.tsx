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
            selector: 'node',
            style: {
              'background-color': '#0074D9',
              label: 'data(label)',
              'text-valign': 'center',
              'text-halign': 'center',
              width: 80,
              height: 60,
              'font-size': 12,
              'text-wrap': 'wrap',
              'text-max-width': '75px'
            }
          },
          // Status-based styling
          {
            selector: 'node.status-Existing',
            style: {
              'background-color': '#2ECC40'
            }
          },
          {
            selector: 'node.status-Regular',
            style: {
              'background-color': '#0074D9'
            }
          },
          {
            selector: 'node.status-Defect',
            style: {
              'background-color': '#FF4136'
            }
          },
          // Area styling
          {
            selector: 'node.area',
            style: {
              'background-color': '#f0f0f0',
              'background-opacity': 0.3,
              'border-width': 2,
              'border-color': '#999',
              shape: 'roundrectangle'
            }
          },
          // Port styling
          {
            selector: 'node.port',
            style: {
              width: 20,
              height: 20,
              'background-color': '#AAAAAA',
              'font-size': 8
            }
          },
          {
            selector: 'node.port-In',
            style: {
              'background-color': '#39CCCC'
            }
          },
          {
            selector: 'node.port-Out',
            style: {
              'background-color': '#FF851B'
            }
          },
          {
            selector: 'node.port-Bidirectional',
            style: {
              'background-color': '#B10DC9'
            }
          },
          // Edge styling
          {
            selector: 'edge',
            style: {
              width: 3,
              'line-color': '#888',
              'target-arrow-color': '#888',
              'target-arrow-shape': 'triangle',
              'curve-style': 'bezier',
              label: 'data(label)',
              'font-size': 10,
              'text-rotation': 'autorotate'
            }
          },
          // Selection styling
          {
            selector: ':selected',
            style: {
              'background-color': '#FF851B',
              'line-color': '#FF851B',
              'target-arrow-color': '#FF851B',
              'border-width': 3,
              'border-color': '#FF851B'
            }
          }
        ],
        layout: { name: layoutName }
      });
      
      cyRef.current = cy;
      
      // Event handlers
      cy.on('tap', 'node', (evt) => {
        const node: NodeSingular = evt.target;
        if (!node.hasClass('port')) {
          selectNode(node.id());
        }
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
        borderRadius: '4px'
      }} 
    />
  );
};