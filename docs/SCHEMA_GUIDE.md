# AV Wiring Graph Schema Guide

## Overview

This guide explains how to create valid JSON files for AVFlowView-cyto.

## Root Structure

```json
{
  "layout": { /* optional layout configuration */ },
  "areas": [ /* optional area definitions */ ],
  "nodes": [ /* required: array of device nodes */ ],
  "edges": [ /* required: array of connections */ ],
  "metadata": { /* optional: custom metadata */ }
}
```

## Node Definition

### Required Fields

- **id**: Unique identifier (must match pattern `^[A-Za-z0-9._:-]+$`)
- **manufacturer**: Device manufacturer name
- **model**: Device model number/name
- **category**: Primary category (e.g., "Video", "Audio", "Network")
- **status**: One of `Existing`, `Regular`, or `Defect`
- **ports**: Object containing port definitions

### Optional Fields

- **subcategory**: More specific categorization
- **label**: Display label (defaults to manufacturer + model)
- **areaId**: Reference to an area for grouping
- **metadata**: Custom data object

### Example Node

```json
{
  "id": "camera-main",
  "manufacturer": "Sony",
  "model": "PXW-Z750",
  "category": "Video",
  "subcategory": "Camera",
  "status": "Regular",
  "label": "Main Stage Camera",
  "areaId": "stage-area",
  "ports": {
    "sdi-out-1": {
      "alignment": "Out",
      "label": "SDI Output 1",
      "type": "SDI",
      "gender": "M"
    }
  },
  "metadata": {
    "serialNumber": "12345",
    "purchaseDate": "2024-01-15"
  }
}
```

## Port Definition

### Required Fields

- **alignment**: One of `In`, `Out`, or `Bidirectional`
- **label**: Human-readable port name
- **type**: Port/connector type (e.g., "SDI", "HDMI", "XLR", "USB-C")
- **gender**: One of `M` (Male), `F` (Female), or `N/A`

### Optional Fields

- **metadata**: Custom port-specific data

### Common Port Types

**Video:**
- SDI (3G-SDI, 12G-SDI)
- HDMI
- DisplayPort
- DVI

**Audio:**
- XLR
- TRS (1/4")
- RCA
- Dante

**Network:**
- RJ45 (Ethernet)
- Fiber (LC, SC)
- USB-C

## Edge Definition

### Required Fields

- **id**: Unique identifier
- **source**: Source node ID
- **target**: Target node ID

### Optional Fields

- **sourcePortKey**: Specific port key in source node
- **targetPortKey**: Specific port key in target node
- **wireId**: Physical wire/cable identifier
- **category**: Cable category
- **subcategory**: Cable subcategory
- **cableType**: Cable specification (e.g., "CAT6", "Fiber OM3")
- **label**: Display label for edge
- **binding**: `auto` or `exact` (port binding mode)
- **metadata**: Custom edge data

### Example Edge

```json
{
  "id": "cable-001",
  "wireId": "W-001",
  "category": "Video",
  "cableType": "3G-SDI",
  "label": "Camera to Switcher",
  "source": "camera-main",
  "sourcePortKey": "sdi-out-1",
  "target": "video-switcher",
  "targetPortKey": "sdi-in-1",
  "binding": "exact",
  "metadata": {
    "length": "15m",
    "installedDate": "2024-01-20"
  }
}
```

## Area Definition

### Required Fields

- **id**: Unique identifier
- **label**: Display name for area

### Optional Fields

- **parentId**: Reference to parent area (for nested areas)
- **metadata**: Custom area data

### Example Area

```json
{
  "id": "control-room",
  "label": "Main Control Room",
  "metadata": {
    "building": "A",
    "floor": 2
  }
}
```

## Layout Configuration

```json
{
  "layout": {
    "direction": "LR",      // "LR" (left-right) or "TB" (top-bottom)
    "portBinding": "auto",  // "auto" or "exact"
    "areaFirst": true,      // Group by areas first
    "areaPadding": 50       // Padding around areas
  }
}
```

## Validation Rules

### ID Pattern
All IDs must match: `^[A-Za-z0-9._:-]+$`

**Valid:**
- `camera-1`
- `device.123`
- `area:stage`
- `node_A1`

**Invalid:**
- `camera 1` (contains space)
- `device@home` (invalid character)
- `node#1` (invalid character)

### Reference Integrity

- All `areaId` references must point to existing areas
- All edge `source` and `target` must reference existing nodes
- All `sourcePortKey`/`targetPortKey` must exist in respective nodes

## Best Practices

### Naming Conventions

1. **IDs**: Use kebab-case (`camera-1`, `audio-mixer-main`)
2. **Labels**: Use clear, descriptive names
3. **Categories**: Use consistent capitalization

### Organization

1. **Group by function**: Video, Audio, Network, Control
2. **Use areas**: Logical (system groups) or physical (rooms)
3. **Consistent port naming**: Follow manufacturer documentation

### Port Keys

1. Use descriptive keys: `sdi-out-1` not `out1`
2. Include direction: `xlr-in-1`, `hdmi-out-2`
3. Number sequentially: `port-1`, `port-2`, `port-3`

### Metadata Usage

Store additional information that doesn't fit standard fields:
- Serial numbers
- Purchase dates
- Installation details
- Maintenance schedules
- Custom identifiers

## Complete Example

See `public/sample-graph.json` for a complete, working example demonstrating:
- Multiple device types
- Port connections
- Area grouping
- Various statuses
- Metadata usage

## Troubleshooting

### Validation Errors

**"Invalid node ID pattern"**
- Check for spaces or special characters
- Use only: letters, numbers, `.`, `_`, `:`, `-`

**"Referenced node does not exist"**
- Verify edge source/target IDs match node IDs exactly
- Check for typos

**"Referenced port does not exist"**
- Ensure sourcePortKey/targetPortKey match port keys in nodes
- Port keys are case-sensitive

**"Missing required fields"**
- All nodes need: id, manufacturer, model, category, status, ports
- All edges need: id, source, target
- Check JSON syntax (commas, quotes, brackets)