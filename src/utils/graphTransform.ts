import { AVWiringGraph, Node as AVNode, Edge as AVEdge } from '../types/graph.types';
import { ElementDefinition } from 'cytoscape';

/**
 * Validates that an ID matches the required pattern
 * @throws Error if ID is invalid
 */
function validateId(id: string, type: string): void {
  const pattern = /^[A-Za-z0-9._:-]+$/;
  if (!pattern.test(id)) {
    throw new Error(`Invalid ${type} ID: "${id}". Must match pattern ^[A-Za-z0-9._:-]+$`);
  }
}

/**
 * Validates that referenced nodes exist in the graph
 * @throws Error if node reference is invalid
 */
function validateNodeReference(nodeId: string, nodes: AVNode[]): void {
  const nodeExists = nodes.some(n => n.id === nodeId);
  if (!nodeExists) {
    throw new Error(`Referenced node "${nodeId}" does not exist in graph`);
  }
}

/**
 * Validates that referenced port exists in a node
 * @throws Error if port reference is invalid
 */
function validatePortReference(nodeId: string, portKey: string, node: AVNode): void {
  if (!node.ports[portKey]) {
    throw new Error(`Referenced port "${portKey}" does not exist in node "${nodeId}"`);
  }
}

/**
 * Transforms AVWiringGraph to Cytoscape.js element definitions
 * @param graph - The A/V wiring graph to transform
 * @returns Array of Cytoscape element definitions
 * @throws Error if validation fails
 */
export function transformToCytoscapeElements(graph: AVWiringGraph): ElementDefinition[] {
  const elements: ElementDefinition[] = [];
  
  // PHASE 1: Transform areas first (parent compound nodes)
  if (graph.areas) {
    // First add root areas (those without parents)
    const rootAreas = graph.areas.filter(area => !area.parentId);
    rootAreas.forEach((area) => {
      validateId(area.id, 'area');
      
      elements.push({
        data: {
          id: area.id,
          label: area.label,
          metadata: area.metadata
        },
        classes: 'area'
      });
    });
    
    // Then add nested areas (those with parents)
    const nestedAreas = graph.areas.filter(area => area.parentId);
    nestedAreas.forEach((area) => {
      validateId(area.id, 'area');
      
      elements.push({
        data: {
          id: area.id,
          label: area.label,
          parent: area.parentId,
          metadata: area.metadata
        },
        classes: 'area'
      });
    });
  }
  
  // PHASE 2: Transform nodes (regular nodes, not compound)
  graph.nodes.forEach((node: AVNode) => {
    validateId(node.id, 'node');
    
    // Build port info for display in node label or metadata
    const portCount = Object.keys(node.ports).length;
    const portSummary = Object.entries(node.ports).map(([key, port]) => ({
      key,
      ...port
    }));
    
    elements.push({
      data: {
        id: node.id,
        label: node.label || `${node.manufacturer} ${node.model}`,
        category: node.category,
        subcategory: node.subcategory,
        status: node.status,
        portCount: portCount,
        ports: portSummary, // Store port info for tooltips/details
        manufacturer: node.manufacturer,
        model: node.model,
        metadata: node.metadata,
        ...(node.areaId && { parent: node.areaId })
      },
      classes: `node node-${node.category} status-${node.status}`
    });
  });
  
  // PHASE 3: Transform edges (connections between nodes)
  graph.edges.forEach((edge: AVEdge) => {
    validateId(edge.id, 'edge');
    validateNodeReference(edge.source, graph.nodes);
    validateNodeReference(edge.target, graph.nodes);
    
    const sourceNode = graph.nodes.find(n => n.id === edge.source);
    const targetNode = graph.nodes.find(n => n.id === edge.target);
    
    // Validate port references if specified
    if (edge.sourcePortKey && sourceNode) {
      validatePortReference(edge.source, edge.sourcePortKey, sourceNode);
    }
    if (edge.targetPortKey && targetNode) {
      validatePortReference(edge.target, edge.targetPortKey, targetNode);
    }
    
    // Build edge label with port information
    let edgeLabel = edge.label || edge.wireId || '';
    if (edge.sourcePortKey || edge.targetPortKey) {
      const portInfo = [];
      if (edge.sourcePortKey && sourceNode) {
        portInfo.push(sourceNode.ports[edge.sourcePortKey].label);
      }
      if (edge.targetPortKey && targetNode) {
        portInfo.push(targetNode.ports[edge.targetPortKey].label);
      }
      if (portInfo.length > 0) {
        edgeLabel = edgeLabel ? `${edgeLabel} (${portInfo.join(' → ')})` : portInfo.join(' → ');
      }
    }
    
    elements.push({
      data: {
        id: edge.id,
        source: edge.source, // Connect directly to nodes, not ports
        target: edge.target,
        label: edgeLabel,
        category: edge.category,
        subcategory: edge.subcategory,
        cableType: edge.cableType,
        wireId: edge.wireId,
        sourcePortKey: edge.sourcePortKey,
        targetPortKey: edge.targetPortKey,
        binding: edge.binding,
        metadata: edge.metadata
      },
      classes: `edge ${edge.category ? `edge-${edge.category}` : 'edge-default'}`
    });
  });
  
  return elements;
}
