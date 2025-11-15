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
 * Professional AV schematic style with:
 * - Inputs connecting on left, outputs on right
 * - Rounded orthogonal edges with multiple segments
 * - Precise edge-to-node attachment points
 * - No overlapping nodes or areas
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
          // Base node style - rectangular for AV equipment
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
              color: '#ffffff',
              'padding': 8
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
              'padding': 40  // More padding to contain children properly
            }
          },
          // Edge styling - orthogonal with rounded corners
          {
            selector: 'edge',
            style: {
              width: 3,
              'line-color': '#888',
              'target-arrow-color': '#888',
              'target-arrow-shape': 'triangle',
              'arrow-scale': 1.2,
              // Orthogonal routing with improvements
              'curve-style': 'taxi',
              'taxi-direction': 'auto',  // Auto-detect best routing
              'taxi-turn': 20,  // Rounded corners (20px radius)
              'taxi-turn-min-distance': 5,  // Allow more turns/segments
              // Edge endpoints - force left and right connections
              'source-endpoint': '100% 50%',  // Right side of source
              'target-endpoint': '0% 50%',    // Left side of target
              // Labels
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
          rankDir: 'LR',  // Left to Right signal flow
          nodeSep: 100,  // Increased horizontal spacing between nodes
          edgeSep: 50,   // Increased spacing between edges
          rankSep: 200,  // Increased vertical spacing between ranks
          padding: 80,
          animate: false,
          fit: true,
          spacingFactor: 1.3,  // Extra spacing factor
          nodeDimensionsIncludeLabels: true
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
      
      // Post-process to ensure child nodes stay inside parent areas
      setTimeout(() => {
        cy.nodes('[parent]').forEach(node => {
          const parent = node.parent();
          if (parent && !parent.empty()) {
            const pbb = parent.boundingBox({ includeLabels: true, includeOverlays: false });
            const nbb = node.boundingBox({ includeLabels: true, includeOverlays: false });
            // Ensure child is fully inside parent with padding
            const PAD = 15;
            let dx = 0, dy = 0;
            if (nbb.x1 < pbb.x1 + PAD) dx = (pbb.x1 + PAD) - nbb.x1;
            if (nbb.x2 > pbb.x2 - PAD) dx = (pbb.x2 - PAD) - nbb.x2;
            if (nbb.y1 < pbb.y1 + PAD) dy = (pbb.y1 + PAD) - nbb.y1;
            if (nbb.y2 > pbb.y2 - PAD) dy = (pbb.y2 - PAD) - nbb.y2;
            if (dx !== 0 || dy !== 0) {
              node.position({ x: node.position('x') + dx, y: node.position('y') + dy });
            }
          }
        });
      }, 100);  // Small delay to allow layout to complete
      
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
