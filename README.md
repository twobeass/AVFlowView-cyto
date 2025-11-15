# AVFlowView-cyto

A React/TypeScript application for visualizing A/V wiring graphs using Cytoscape.js as the graph rendering engine.

## Features

- 📊 Interactive graph visualization of A/V wiring systems
- 🎨 Color-coded nodes based on device status (Existing, Regular, Defect)
- 🔍 Filter nodes by category
- 🔎 Zoom controls and pan functionality
- 📝 Port-level connections with alignment indicators
- 🏢 Area grouping support for logical/physical organization
- ✅ JSON schema validation
- 🧪 Comprehensive unit tests

## Technology Stack

- **React 18.x** with **TypeScript 5.x**
- **Cytoscape.js 3.x** - Graph rendering engine
- **Zustand** - State management
- **Vite** - Build tool
- **Vitest** - Unit testing
- **ESLint + Prettier** - Code quality

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/twobeass/AVFlowView-cyto.git
cd AVFlowView-cyto

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Testing

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Build for Production

```bash
# Build the application
npm run build

# Preview production build
npm run preview
```

## Usage

1. **Upload Graph Data**: Click the file upload button and select a JSON file conforming to the AV Wiring Graph schema
2. **View Graph**: The graph will render automatically with color-coded nodes and edges
3. **Filter**: Use the filter panel (top-left) to show/hide nodes by category
4. **Navigate**: Use zoom controls (top-right) or mouse wheel to zoom; click and drag to pan
5. **Select**: Click on nodes or edges to select them (highlighted in orange)

## Sample Data

A sample graph file is included at `public/sample-graph.json` demonstrating:
- Multiple device types (cameras, mixers, monitors, microphones)
- Different categories (Video, Audio)
- Port connections with exact binding
- Area grouping (Stage Area, Control Room)
- Various device statuses

## Project Structure

```
AVFlowView-cyto/
├── src/
│   ├── components/
│   │   ├── graph/
│   │   │   └── CytoscapeGraph.tsx    # Main graph visualization
│   │   └── ui/
│   │       ├── FilterPanel.tsx        # Category filter UI
│   │       └── ZoomControls.tsx       # Zoom control buttons
│   ├── store/
│   │   └── graphStore.ts              # Zustand state management
│   ├── types/
│   │   └── graph.types.ts             # TypeScript type definitions
│   ├── schemas/
│   │   └── av-wiring-graph.schema.json # JSON schema
│   ├── utils/
│   │   ├── validation.ts              # Schema validation
│   │   └── graphTransform.ts          # Graph data transformation
│   ├── App.tsx                        # Main application component
│   ├── main.tsx                       # Application entry point
│   └── index.css                      # Global styles
├── tests/
│   ├── setup.ts                       # Test configuration
│   ├── validation.test.ts             # Validation tests
│   ├── graphStore.test.ts             # Store tests
│   └── graphTransform.test.ts         # Transformation tests
├── public/
│   └── sample-graph.json              # Sample data file
└── docs/                              # Additional documentation
```

## Graph Data Schema

The application expects JSON data conforming to the AV Wiring Graph schema. Key elements:

### Node Structure
```typescript
{
  "id": "unique-id",              // Pattern: ^[A-Za-z0-9._:-]+$
  "manufacturer": "Sony",
  "model": "PXW-Z750",
  "category": "Video",
  "status": "Regular",            // Existing | Regular | Defect
  "areaId": "area-1",             // Optional area grouping
  "ports": {
    "port-1": {
      "alignment": "Out",          // In | Out | Bidirectional
      "label": "SDI Out",
      "type": "SDI",
      "gender": "M"                // M | F | N/A
    }
  }
}
```

### Edge Structure
```typescript
{
  "id": "edge-1",
  "source": "node-1",
  "target": "node-2",
  "sourcePortKey": "port-1",    // Optional
  "targetPortKey": "port-2",    // Optional
  "cableType": "SDI",
  "binding": "exact"             // auto | exact
}
```

## Color Coding

- 🟦 **Regular nodes**: Blue (#0074D9)
- 🟩 **Existing nodes**: Green (#2ECC40)
- 🟥 **Defect nodes**: Red (#FF4136)
- 🟦 **Input ports**: Cyan (#39CCCC)
- 🟧 **Output ports**: Orange (#FF851B)
- 🟪 **Bidirectional ports**: Purple (#B10DC9)
- 🟧 **Selected items**: Orange (#FF851B)

## Development

### Code Quality

```bash
# Run ESLint
npm run lint

# Format code with Prettier
npm run format
```

### TypeScript

The project uses strict TypeScript configuration:
- No implicit `any` types
- Explicit function return types required
- Strict null checks enabled

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Write tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Acknowledgments

- [Cytoscape.js](https://js.cytoscape.org/) - Graph visualization library
- [Zustand](https://zustand-demo.pmnd.rs/) - State management
- [Vite](https://vitejs.dev/) - Build tool
- [Vitest](https://vitest.dev/) - Testing framework