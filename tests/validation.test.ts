import { describe, it, expect } from 'vitest';
import { validateAVWiringGraph, getValidationErrors } from '../src/utils/validation';
import { AVWiringGraph } from '../src/types/graph.types';

describe('AVWiringGraph Validation', () => {
  it('should validate correct graph structure', () => {
    const validGraph: AVWiringGraph = {
      nodes: [
        {
          id: 'node1',
          manufacturer: 'Manufacturer A',
          model: 'Model X',
          category: 'Audio',
          status: 'Regular',
          ports: {
            port1: {
              alignment: 'In',
              label: 'Input 1',
              type: 'XLR',
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
          sourcePortKey: 'port1'
        }
      ]
    };

    expect(validateAVWiringGraph(validGraph)).toBe(true);
  });

  it('should reject invalid node ID pattern', () => {
    const invalidGraph = {
      nodes: [
        {
          id: 'invalid node!', // Contains space and special char
          manufacturer: 'Test',
          model: 'Test',
          category: 'Test',
          status: 'Regular',
          ports: {}
        }
      ],
      edges: []
    };

    expect(validateAVWiringGraph(invalidGraph)).toBe(false);
  });

  it('should reject missing required fields', () => {
    const invalidGraph = {
      nodes: [
        {
          id: 'node1',
          // Missing manufacturer, model, category
          status: 'Regular',
          ports: {}
        }
      ],
      edges: []
    };

    expect(validateAVWiringGraph(invalidGraph)).toBe(false);
  });
});