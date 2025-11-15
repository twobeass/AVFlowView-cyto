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
    expect(elements.length).toBe(1); // Only 1 node, no edges
    expect(elements[0].data.id).toBe('node1');
    expect(elements[0].data.category).toBe('Video');
    expect(elements[0].data.portCount).toBe(1);
  });

  it('should transform graph with edges and port information', () => {
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
        },
        {
          id: 'node2',
          manufacturer: 'Blackmagic',
          model: 'ATEM',
          category: 'Video',
          status: 'Regular',
          ports: {
            in1: {
              alignment: 'In',
              label: 'SDI In',
              type: 'SDI',
              gender: 'F'
            }
          }
        }
      ],
      edges: [
        {
          id: 'edge1',
          source: 'node1',
          target: 'node2',
          sourcePortKey: 'out1',
          targetPortKey: 'in1'
        }
      ]
    };

    const elements = transformToCytoscapeElements(graph);
    expect(elements.length).toBe(3); // 2 nodes + 1 edge
    
    const edge = elements.find(el => el.data.id === 'edge1');
    expect(edge).toBeDefined();
    expect(edge?.data.source).toBe('node1');
    expect(edge?.data.target).toBe('node2');
    expect(edge?.data.sourcePortKey).toBe('out1');
    expect(edge?.data.targetPortKey).toBe('in1');
  });

  it('should handle areas and compound nodes', () => {
    const graph: AVWiringGraph = {
      areas: [
        {
          id: 'area1',
          label: 'Stage'
        }
      ],
      nodes: [
        {
          id: 'node1',
          manufacturer: 'Sony',
          model: 'Camera1',
          category: 'Video',
          status: 'Regular',
          areaId: 'area1',
          ports: {}
        }
      ],
      edges: []
    };

    const elements = transformToCytoscapeElements(graph);
    expect(elements.length).toBe(2); // 1 area + 1 node
    
    const area = elements.find(el => el.data.id === 'area1');
    expect(area).toBeDefined();
    expect(area?.classes).toContain('area');
    
    const node = elements.find(el => el.data.id === 'node1');
    expect(node?.data.parent).toBe('area1');
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

    expect(() => transformToCytoscapeElements(graph)).toThrow(/Invalid node ID/);
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

    expect(() => transformToCytoscapeElements(graph)).toThrow(/does not exist in graph/);
  });

  it('should throw error for non-existent port reference', () => {
    const graph: AVWiringGraph = {
      nodes: [
        {
          id: 'node1',
          manufacturer: 'Test',
          model: 'Test',
          category: 'Test',
          status: 'Regular',
          ports: {
            port1: {
              alignment: 'Out',
              label: 'Out',
              type: 'SDI',
              gender: 'M'
            }
          }
        },
        {
          id: 'node2',
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
          target: 'node2',
          sourcePortKey: 'nonexistent-port'
        }
      ]
    };

    expect(() => transformToCytoscapeElements(graph)).toThrow(/does not exist in node/);
  });
});
