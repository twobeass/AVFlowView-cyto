# Architecture Documentation

## Overview

AVFlowView-cyto is built using a modern React architecture with clear separation of concerns.

## Architecture Layers

### 1. Presentation Layer (Components)

**Location**: `src/components/`

- **CytoscapeGraph**: Core visualization component that integrates Cytoscape.js
- **FilterPanel**: UI component for filtering nodes by category
- **ZoomControls**: UI component for zoom and fit operations

These components are purely presentational and rely on the store for state.

### 2. State Management Layer

**Location**: `src/store/`

- **graphStore.ts**: Zustand store managing:
  - Graph data
  - Selected node/edge
  - Filter state
  - Zoom level

**Why Zustand?**
- Minimal boilerplate
- TypeScript-first
- No provider wrapping required
- Simple API for complex state

### 3. Business Logic Layer

**Location**: `src/utils/`

- **validation.ts**: JSON schema validation using AJV
- **graphTransform.ts**: Transforms AV Wiring Graph data to Cytoscape format

### 4. Type System

**Location**: `src/types/` & `src/schemas/`

- TypeScript interfaces derived from JSON schema
- Ensures type safety across the application
- Single source of truth for data structure

## Data Flow

```
User Upload JSON File
       ↓
   Validation (AJV)
       ↓
   Store (Zustand)
       ↓
  Transformation
       ↓
Cytoscape Rendering
```

## Key Design Decisions

### Port Representation

Ports are represented as child nodes in Cytoscape:
- Enables precise edge connections
- Allows independent port styling
- Supports complex routing scenarios

### Area Grouping

Areas use Cytoscape's compound node feature:
- Nodes with `parent` property are visually grouped
- Enables hierarchical organization
- Supports nested areas

### State Management

Zustand over Redux because:
- Less boilerplate for simple state
- Direct store access without hooks complexity
- Better TypeScript integration
- Sufficient for application scale

### Validation Strategy

JSON Schema validation before rendering:
- Prevents invalid data from corrupting UI
- Provides clear error messages
- Schema serves as documentation

## Performance Considerations

### Large Graphs

- Cytoscape.js handles 500+ nodes efficiently
- Layout calculations may be slow for 1000+ nodes
- Consider implementing Web Workers for heavy layouts (placeholder in structure)

### Re-rendering Optimization

- Zustand's selective subscriptions prevent unnecessary re-renders
- Cytoscape instance recreated only when graph data changes
- React.memo can be applied to child components if needed

## Extension Points

### Adding New Layouts

Cytoscape supports multiple layout algorithms:
```typescript
layoutName="cose"  // Force-directed
layoutName="breadthfirst"  // Hierarchical
layoutName="dagre"  // Requires cytoscape-dagre extension
```

### Custom Styling

Modify styles in `CytoscapeGraph.tsx`:
```typescript
style: [
  {
    selector: 'node.custom-class',
    style: { /* custom styles */ }
  }
]
```

### Additional Filters

Extend `graphStore.ts` with new filter types:
```typescript
filterByManufacturer: string[];
filterByStatus: NodeStatus[];
```

## Testing Strategy

### Unit Tests
- Utils functions (validation, transformation)
- Store actions and state updates

### Integration Tests
- Component rendering with various data
- User interactions (click, zoom, filter)

### E2E Tests (Future)
- Full user workflows
- File upload to visualization

## Security Considerations

- JSON validation prevents malicious data injection
- No server-side components (pure client-side)
- File upload restricted to JSON mime type
- No external API calls or data persistence