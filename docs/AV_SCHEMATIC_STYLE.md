# AV Schematic Visual Style Guide

## Overview

AVFlowView-cyto uses a professional A/V system design aesthetic that mimics traditional wiring diagrams and signal flow charts used in broadcast, live events, and installed sound systems.

## Design Principles

### 1. Signal Flow Layout

**Implementation**: Dagre hierarchical layout with `rankDir: 'LR'` (Left-to-Right)

- Devices are arranged in **signal flow order**
- Sources (cameras, microphones) appear on the left
- Processing equipment (mixers, switchers) in the middle  
- Destinations (monitors, speakers, recorders) on the right
- Clear visual hierarchy from input to output

**Benefits**:
- Intuitive understanding of signal path
- Easy troubleshooting and system design review
- Matches industry-standard documentation

### 2. Orthogonal Edge Routing

**Implementation**: `'curve-style': 'taxi'` with automatic turn direction

```typescript
'curve-style': 'taxi',           // Right-angle routing
'taxi-direction': 'auto',        // Smart turn selection
'taxi-turn': 50,                 // Corner radius (50px)
'taxi-turn-min-distance': 10     // Minimum segment length
```

**Visual Characteristics**:
- Edges only travel horizontally or vertically
- Clean 90-degree turns with slight rounding
- No diagonal lines or bezier curves
- Resembles cable routing in rack diagrams

**Benefits**:
- Reduces visual clutter
- Makes parallel cables easier to distinguish
- Professional appearance matching technical drawings
- Better readability for complex systems

### 3. Rectangular Node Geometry

**Implementation**: `shape: 'rectangle'` with consistent sizing

```typescript
width: 120,    // Standard equipment width
height: 60,    // Standard equipment height
shape: 'rectangle',
'border-width': 3
```

**Visual Style**:
- Solid rectangular blocks
- Thick borders for definition
- White text on colored background
- Equipment labels centered

**Benefits**:
- Represents rack-mounted equipment appearance
- Easy to read manufacturer and model info
- Consistent sizing aids visual scanning

### 4. Category-Based Color Coding

#### Video Devices
- **Color**: Blue (#0074D9)
- **Border**: Dark Blue (#003d82)
- **Examples**: Cameras, switchers, monitors, scalers, recorders

#### Audio Devices  
- **Color**: Purple (#B10DC9)
- **Border**: Dark Purple (#7b0a8f)
- **Examples**: Microphones, mixers, speakers, processors, recorders

#### Network Devices
- **Color**: Cyan (#39CCCC)
- **Border**: Dark Cyan (#2a9999)
- **Examples**: Switches, routers, media converters, streamers

#### Status Overlays

**Existing Equipment** (Green)
- Color: #2ECC40
- Border: #1f8c2b
- Indicates pre-existing/legacy equipment
- Overrides category color

**Defect Equipment** (Red)
- Color: #FF4136  
- Border: #cc1f17 (dashed)
- Indicates faulty or non-functional equipment
- Dashed border for immediate recognition
- Overrides category color

### 5. Edge Styling

#### Base Edge Style
```typescript
width: 3,
'line-color': '#888',           // Neutral gray
'target-arrow-shape': 'triangle'
```

#### Category-Specific Edges
- **Video**: Blue (#0074D9), width 4px
- **Audio**: Purple (#B10DC9), width 4px  
- **Network**: Cyan (#39CCCC), width 4px

#### Edge Labels
- White background with rounded corners
- 90% opacity for slight transparency
- Text rotation disabled (`'text-rotation': 'none'`)
- Positioned above edge line (`'text-margin-y': -10`)

**Label Content**:
- Cable ID or wire number
- Source and target port names
- Example: "W-001 (SDI Out 1 → SDI In 1)"

### 6. Area Grouping

**Implementation**: Compound nodes with minimal styling

```typescript
'background-color': '#f0f0f0',
'background-opacity': 0.2,      // Very subtle
'border-style': 'dashed',       // Non-solid for distinction
'border-color': '#999',
shape: 'rectangle',
'padding': 30
```

**Visual Characteristics**:
- Subtle gray background (20% opacity)
- Dashed border to differentiate from equipment
- Label at top center
- Sufficient padding around contained nodes

**Use Cases**:
- Physical locations ("Stage", "Control Room", "FOH")
- Logical groupings ("Camera System", "Audio Chain")
- Equipment racks ("Rack 1", "Rack 2")

### 7. Selection Feedback

**Selected State**: Orange (#FF851B)

- Overrides all other colors
- Increases border width to 4px
- Changes border to solid (overrides dashed defect borders)
- Applied to both nodes and edges
- Clear visual indication of user interaction

## Layout Configuration

### Dagre Parameters

```typescript
layout: {
  name: 'dagre',
  rankDir: 'LR',        // Left-to-Right signal flow
  nodeSep: 80,          // 80px horizontal spacing
  edgeSep: 40,          // 40px edge separation  
  rankSep: 150,         // 150px between layers/ranks
  padding: 50,          // 50px canvas padding
  animate: false,       // Disabled for stability
  fit: true,            // Auto-fit to viewport
  spacingFactor: 1.2    // 20% extra spacing
}
```

**Rationale**:
- `nodeSep: 80` - Provides breathing room between parallel equipment
- `rankSep: 150` - Clear separation between signal processing stages
- `animate: false` - Prevents layout animation bugs on unmount
- `fit: true` - Ensures entire system visible on load

### Alternative Layouts

#### Top-to-Bottom Flow
```typescript
rankDir: 'TB'  // Change to vertical signal flow
```
Useful for:
- Vertical rack diagrams
- Broadcast signal chains  
- Simpler systems with few stages

#### Tighter Spacing
```typescript
nodeSep: 50,
rankSep: 100,
spacingFactor: 1.0
```
Useful for:
- Large systems with many devices
- Fitting more on screen
- Printing at smaller sizes

## Typography

### Node Labels
- **Font Size**: 11px
- **Font Weight**: 600 (semi-bold)
- **Color**: White (#ffffff)
- **Text Wrap**: Enabled
- **Max Width**: 110px
- **Alignment**: Center horizontal and vertical

### Edge Labels  
- **Font Size**: 9px
- **Font Weight**: Normal (400)
- **Color**: Black (default)
- **Background**: White with 90% opacity
- **Text Rotation**: None (always horizontal)

### Area Labels
- **Font Size**: 14px
- **Font Weight**: Bold (700)
- **Color**: Gray (#666)
- **Alignment**: Top center
- **Margin**: 10px from top edge

## Best Practices

### For System Designers

1. **Organize by signal flow** - Place sources before processors before destinations
2. **Group related equipment** - Use areas for physical locations or logical subsystems
3. **Use consistent naming** - Follow manufacturer model numbers exactly
4. **Document port connections** - Always specify source and target ports
5. **Mark defects clearly** - Use defect status for broken or offline equipment

### For Large Systems

1. **Break into subsystems** - Use multiple graphs or areas for complex installations
2. **Reduce node labels** - Use shorter equipment nicknames if model names are long
3. **Adjust spacing** - Decrease `nodeSep` and `rankSep` for tighter layouts
4. **Use filters** - Hide categories not currently relevant
5. **Print in landscape** - LR layouts work best in landscape orientation

### For Presentations

1. **Use status colors** - Show what's existing vs. new in proposals
2. **Highlight signal paths** - Use selection to emphasize specific connections
3. **Export as image** - Cytoscape supports PNG/JPEG export (add export button)
4. **Remove clutter** - Hide metadata and use minimal labels

## Technical Implementation Notes

### Dagre Extension Registration

```typescript
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';

// Must register before creating cytoscape instance
cytoscape.use(dagre);
```

### Taxi Edge Limitations

- Taxi routing works best with hierarchical layouts (dagre, breadthfirst)
- May produce suboptimal routes with force-directed layouts (cose, cola)
- Turn radius cannot be zero (minimum ~10px)
- Very tight node spacing can cause edge overlap

### Performance Considerations

- Dagre layout: O(V + E) time complexity
- Taxi routing: Additional overhead for path calculation
- Recommended max: 200 nodes, 500 edges
- For larger systems: disable animation, use simpler edge styles

## Future Enhancements

### Potential Additions

1. **Port visualization** - Small circles/squares at node edges showing connection points
2. **Cable bundling** - Group parallel cables visually
3. **Signal direction indicators** - Animated flow or gradient edges
4. **Equipment icons** - SVG icons for common device types
5. **Rack elevation view** - 2D representation of physical rack mounting
6. **Layer control** - Show/hide different signal types (video/audio/control)
7. **Export options** - PDF, SVG, or PNG export functionality
8. **Print stylesheet** - Optimized layout for printing

### Customization Options

Users could customize:
- Color schemes (dark mode, high contrast)
- Layout direction and spacing
- Edge routing algorithm (taxi vs bezier vs straight)
- Node shapes and sizes
- Label visibility and positioning

## References

- **Cytoscape.js Documentation**: https://js.cytoscape.org/
- **Dagre Layout**: https://github.com/dagrejs/dagre
- **Taxi Edge Routing**: https://js.cytoscape.org/#style/edge-line (curve-style: taxi)
- **Professional AV Standards**: SMPTE, AES, Dante specifications
