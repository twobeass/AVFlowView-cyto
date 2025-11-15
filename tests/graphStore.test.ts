import { describe, it, expect, beforeEach } from 'vitest';
import { useGraphStore } from '../src/store/graphStore';
import { AVWiringGraph } from '../src/types/graph.types';

describe('Graph Store', () => {
  beforeEach(() => {
    useGraphStore.getState().resetGraph();
  });

  it('should initialize with default state', () => {
    const state = useGraphStore.getState();
    expect(state.graph).toBeNull();
    expect(state.selectedNodeId).toBeNull();
    expect(state.zoomLevel).toBe(1);
  });

  it('should load graph and clear selections', () => {
    const mockGraph: AVWiringGraph = {
      nodes: [],
      edges: []
    };

    useGraphStore.getState().loadGraph(mockGraph);
    const state = useGraphStore.getState();
    
    expect(state.graph).toBe(mockGraph);
    expect(state.selectedNodeId).toBeNull();
    expect(state.selectedEdgeId).toBeNull();
  });

  it('should select node and clear edge selection', () => {
    useGraphStore.getState().selectNode('node1');
    const state = useGraphStore.getState();
    
    expect(state.selectedNodeId).toBe('node1');
    expect(state.selectedEdgeId).toBeNull();
  });
});