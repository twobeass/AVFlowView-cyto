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
  
  // Transform areas first (if they exist)
  if (graph.areas) {
    graph.areas.forEach((area) => {
      validateId(area.id, 'area');
      
      elements.push({
        data: {
          id: area.id,
          label: area.label,
          parent: area.parentId
        },
        classes: 'area'
      });
    });
  }
  
  // Transform nodes
  graph.nodes.forEach((node: AVNode) => {
    validateId(node.id, 'node');
    
    elements.push({
      data: {
        id: node.id,
        label: node.label || `${node.manufacturer} ${node.model}`,
        category: node.category,
        subcategory: node.subcategory,
        status: node.status,
        ports: node.ports,
        areaId: node.areaId,
        manufacturer: node.manufacturer,
        model: node.model,
        metadata: node.metadata
      },
      classes: `node-${node.category} status-${node.status}`,
      ...(node.areaId && { parent: node.areaId })
    });
    
    // Transform ports as child nodes
    Object.entries(node.ports).forEach(([portKey, port]) => {
      const portId = `${node.id}:${portKey}`;
      
      elements.push({
        data: {
          id: portId,
          label: port.label,
          parent: node.id,
          portAlignment: port.alignment,
          portType: port.type,
          portGender: port.gender,
          portKey: portKey,
          metadata: port.metadata
        },
        classes: `port port-${port.alignment}`
      });
    });
  });
  
  // Transform edges
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
    
    // Build source and target IDs (with port keys if specified)
    const sourceId = edge.sourcePortKey 
      ? `${edge.source}:${edge.sourcePortKey}` 
      : edge.source;
    const targetId = edge.targetPortKey 
      ? `${edge.target}:${edge.targetPortKey}` 
      : edge.target;
      
    elements.push({
      data: {
        id: edge.id,
        source: sourceId,
        target: targetId,
        label: edge.label || edge.wireId,
        category: edge.category,
        subcategory: edge.subcategory,
        cableType: edge.cableType,
        wireId: edge.wireId,
        binding: edge.binding,
        metadata: edge.metadata
      },
      classes: `edge edge-${edge.category || 'default'}`
    });
  });
  
  return elements;
}
