import { create } from 'zustand';
import { AVWiringGraph } from '../types/graph.types';

interface GraphState {
  // State
  graph: AVWiringGraph | null;
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  filterCategories: string[];
  zoomLevel: number;
  
  // Actions
  loadGraph: (graph: AVWiringGraph) => void;
  selectNode: (nodeId: string | null) => void;
  selectEdge: (edgeId: string | null) => void;
  setFilterCategories: (categories: string[]) => void;
  setZoomLevel: (level: number) => void;
  resetGraph: () => void;
}

export const useGraphStore = create<GraphState>((set) => ({
  // Initial state
  graph: null,
  selectedNodeId: null,
  selectedEdgeId: null,
  filterCategories: [],
  zoomLevel: 1,
  
  // Actions
  loadGraph: (graph) => {
    set({ graph, selectedNodeId: null, selectedEdgeId: null });
  },
  
  selectNode: (nodeId) => {
    set({ selectedNodeId: nodeId, selectedEdgeId: null });
  },
  
  selectEdge: (edgeId) => {
    set({ selectedEdgeId: edgeId, selectedNodeId: null });
  },
  
  setFilterCategories: (categories) => {
    set({ filterCategories: categories });
  },
  
  setZoomLevel: (level) => {
    set({ zoomLevel: level });
  },
  
  resetGraph: () => {
    set({
      graph: null,
      selectedNodeId: null,
      selectedEdgeId: null,
      filterCategories: [],
      zoomLevel: 1
    });
  },
}));
