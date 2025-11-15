import { describe, it, expect } from 'vitest';
import { transformToCytoscapeElements } from '../src/utils/graphTransform';
import { AVWiringGraph } from '../src/types/graph.types';

describe('Graph Transformation', () => {
  it('should transform valid graph to Cytoscape elements', () => {
    const graph: AVWiringGraph = {
      nodes: [
        {
          id: 'node1',
          manufacturer: 'Sony',
          model: 'Camera1',
          category: 'Video',
          status: 'Regular',
          ports: {
            out1: {
              alignment: 'Out',
              label: 'SDI Out',
              type: 'SDI',
              gender: 'M'
            }
          }
        }
      ],
      edges: []
    };

    const elements = transformToCytoscapeElements(graph);
    expect(elements.length).toBeGreaterThan(0);
    expect(elements[0].data.id).toBe('node1');
  });

  it('should throw error for invalid node ID', () => {
    const graph: AVWiringGraph = {
      nodes: [
        {
          id: 'invalid id!',
          manufacturer: 'Test',
          model: 'Test',
          category: 'Test',
          status: 'Regular',
          ports: {}
        }
      ],
      edges: []
    };

    expect(() => transformToCytoscapeElements(graph)).toThrow();
  });

  it('should throw error for non-existent node reference', () => {
    const graph: AVWiringGraph = {
      nodes: [
        {
          id: 'node1',
          manufacturer: 'Test',
          model: 'Test',
          category: 'Test',
          status: 'Regular',
          ports: {}
        }
      ],
      edges: [
        {
          id: 'edge1',
          source: 'node1',
          target: 'nonexistent'
        }
      ]
    };

    expect(() => transformToCytoscapeElements(graph)).toThrow();
  });
});