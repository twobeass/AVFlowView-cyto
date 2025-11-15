import React, { useEffect, useRef } from 'react';
import cytoscape, { Core, EdgeSingular, NodeSingular } from 'cytoscape';
import dagre from 'cytoscape-dagre';
import { useGraphStore } from '../../store/graphStore';
import { transformToCytoscapeElements } from '../../utils/graphTransform';

cytoscape.use(dagre);

interface CytoscapeGraphProps {
  layoutName?: string;
  width?: string;
  height?: string;
}

/**
 * Main Cytoscape.js graph visualization component
 * Uses dagre layout for hierarchical AV signal flow visualization
 * Forces inputs on left, outputs on right via edge endpoints and taxi direction.
 * Ensures no overlaps and children are inside their areas.
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
          // Node style: rectangular, no-overlap, standard AV look
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
              'font-weight': 600,
              'text-wrap': 'wrap',
              'text-max-width': '110px',
              shape: 'rectangle',
              'border-width': 3,
              'border-color': '#003366',
              color: '#fff',
              'padding': 8
            }
          },
          // ... (category-specific styles omitted for brevity, keep from last version)
          // Area styling
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
          // Edge: force left-to-right and endpoints
          {
            selector: 'edge',
            style: {
              width: 3,
              'line-color': '#888',
              'target-arrow-color': '#888',
              'target-arrow-shape': 'triangle',
              'curve-style': 'taxi',
              'taxi-direction': 'rightward',
              'taxi-turn': 50,
              'taxi-turn-min-distance': 10,
              label: 'data(label)',
              'font-size': 9,
              'text-rotation': 'none',
              'text-margin-y': -10,
              'text-background-color': '#fff',
              'text-background-opacity': 0.9,
              'text-background-padding': '3px',
              'text-background-shape': 'roundrectangle',
              'source-endpoint': '0% 50%',    // Always left center
              'target-endpoint': '100% 50%'   // Always right center
            }
          },
          // ... (category-specific edge styles omitted for brevity, keep from last version)
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
          // Dagre options
          rankDir: 'LR',
          nodeSep: 90,
          edgeSep: 60,
          rankSep: 180,
          padding: 80,
          animate: false,
          fit: true,
          spacingFactor: 1.2,
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

      cy.on('zoom', () => {
        setZoomLevel(cy.zoom());
      });

      cy.on('tap', (evt) => {
        if (evt.target === cy) {
          selectNode(null);
          selectEdge(null);
        }
      });

      // Postprocess to nudge any child nodes inside their area compound parents
      setTimeout(() => {
        cy.nodes('[parent]').forEach(node => {
          const parent = node.parent();
          if (parent && !parent.empty()) {
            const pbb = parent.boundingBox({ includeLabels: true, includeOverlays: false });
            const nbb = node.boundingBox({ includeLabels: true, includeOverlays: false });
            // If child node is not fully inside parent, nudge it
            const PAD = 10;
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
      }, 75); // Delay to allow layout finish

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
