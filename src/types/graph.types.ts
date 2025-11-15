// Core enum types from schema
export type PortAlignment = 'In' | 'Out' | 'Bidirectional';
export type PortGender = 'M' | 'F' | 'N/A';
export type NodeStatus = 'Existing' | 'Regular' | 'Defect';
export type LayoutDirection = 'LR' | 'TB';
export type PortBinding = 'auto' | 'exact';

/**
 * Represents a single port on a device node
 */
export interface Port {
  alignment: PortAlignment;
  label: string;
  type: string; // Examples: "USB-C", "XLR", "SDI", "HDMI"
  gender: PortGender;
  metadata?: Record<string, unknown>;
}

/**
 * Represents a device node in the A/V wiring graph
 */
export interface Node {
  id: string; // Must match pattern: ^[A-Za-z0-9._:-]+$
  manufacturer: string;
  model: string;
  category: string;
  subcategory?: string;
  status: NodeStatus;
  label?: string;
  areaId?: string;
  ports: Record<string, Port>; // Key = Port ID, Value = Port object
  metadata?: Record<string, unknown>;
}

/**
 * Represents a connection/cable between two nodes or ports
 */
export interface Edge {
  id: string; // Must match pattern: ^[A-Za-z0-9._:-]+$
  wireId?: string;
  category?: string;
  subcategory?: string;
  cableType?: string; // Examples: "CAT7", "Fiber", "HDMI"
  label?: string;
  source: string; // Node ID
  sourcePortKey?: string; // Port key in source node
  target: string; // Node ID
  targetPortKey?: string; // Port key in target node
  binding?: PortBinding;
  metadata?: Record<string, unknown>;
}

/**
 * Represents a logical or physical area grouping nodes
 */
export interface Area {
  id: string; // Must match pattern: ^[A-Za-z0-9._:-]+$
  label: string;
  parentId?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Configuration for graph layout algorithm
 */
export interface LayoutConfig {
  direction?: LayoutDirection;
  portBinding?: PortBinding;
  areaFirst?: boolean;
  areaPadding?: number;
}

/**
 * Root structure for A/V wiring graph
 */
export interface AVWiringGraph {
  layout?: LayoutConfig;
  areas?: Area[];
  nodes: Node[];
  edges: Edge[];
  metadata?: Record<string, unknown>;
}
