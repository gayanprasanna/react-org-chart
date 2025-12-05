# React Org Chart

<div align="center">

A flexible and customizable React organization chart component with interactive features including search, zoom, pan, and node expansion/collapse.

[![npm version](https://img.shields.io/npm/v/react-org-chart.svg)](https://www.npmjs.com/package/react-org-chart)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

## ✨ Features

- 🎨 **Fully Customizable** - Complete theme support for colors, fonts, sizes, and styling
- 🔍 **Smart Search** - Autocomplete search with suggestions and keyboard navigation
- 🔎 **Zoom & Pan** - Interactive zoom controls with smooth panning and transitions
- 📊 **Hierarchical Display** - Top-down tree layout with expandable/collapsible nodes
- 🎯 **Node Highlighting** - Visual highlighting of searched nodes
- 🖼️ **Image Support** - Support for both URL images and base64 encoded images
- 📱 **Responsive** - Works seamlessly on different screen sizes
- 🎭 **Generic Data Structure** - Flexible field mapping for custom data structures
- ⌨️ **Keyboard Accessible** - Full keyboard navigation support
- 🎪 **Smooth Animations** - Smooth transitions for zoom, pan, and node expansion

## 📦 Installation

```bash
npm install react-org-chart
# or
yarn add react-org-chart
# or
pnpm add react-org-chart
```

### Peer Dependencies

This library requires React 18+ or 19+ and React DOM:

```bash
npm install react react-dom
```

### CSS Styles

The component includes CSS styles that are automatically imported. If you need to import them separately:

```tsx
import "react-org-chart/styles";
// or
import "react-org-chart/dist/react-org-chart.css";
```

## 🚀 Quick Start

```tsx
import { OrgChart } from "react-org-chart";

const data = {
  name: "John Doe",
  role: "CEO",
  photo: "https://example.com/photo.jpg",
  children: [
    {
      name: "Jane Smith",
      role: "CTO",
      photo: "https://example.com/jane.jpg",
      children: [
        {
          name: "Bob Johnson",
          role: "Senior Developer",
          photo: "https://example.com/bob.jpg",
        },
      ],
    },
    {
      name: "Alice Williams",
      role: "CFO",
      photo: "https://example.com/alice.jpg",
    },
  ],
};

function App() {
  return <OrgChart data={data} />;
}
```

## 📖 Usage Examples

### Basic Usage

The simplest way to use the component is with default settings:

```tsx
import { OrgChart } from "react-org-chart";

function App() {
  const orgData = {
    name: "CEO Name",
    role: "Chief Executive Officer",
    children: [
      { name: "Manager 1", role: "Manager" },
      { name: "Manager 2", role: "Manager" },
    ],
  };

  return <OrgChart data={orgData} />;
}
```

### Custom Theme

Customize the appearance with a theme object:

```tsx
import { OrgChart, defaultTheme } from "react-org-chart";

const customTheme = {
  nodeCard: {
    width: 180,
    height: 180,
    padding: 20,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    fontFamily: "Arial, sans-serif",
  },
  avatar: {
    size: 80,
    borderRadius: "50%",
    backgroundColor: "#e0e0e0",
    marginBottom: 12,
  },
  text: {
    name: {
      fontSize: 18,
      fontWeight: 600,
      color: "#1a1a1a",
    },
    role: {
      fontSize: 14,
      color: "#666666",
      opacity: 0.9,
    },
  },
  links: {
    strokeColor: "#b0b0b0",
    strokeWidth: 2,
    verticalSpacing: 40,
  },
  layout: {
    verticalSpacing: 350,
    horizontalSpacing: 250,
    topMargin: 50,
  },
  container: {
    backgroundColor: "#f5f5f5",
    width: "100%",
    height: "100vh",
  },
  highlight: {
    borderColor: "#4a90e2",
    borderWidth: 3,
  },
};

function App() {
  return <OrgChart data={orgData} theme={customTheme} />;
}
```

### Custom Field Mapping

If your data uses different field names:

```tsx
<OrgChart
  data={orgData}
  fieldMapping={{
    title: "fullName",    // Your data uses "fullName" instead of "name"
    subtitle: "jobTitle", // Your data uses "jobTitle" instead of "role"
    photo: "avatarUrl",   // Your data uses "avatarUrl" instead of "photo"
  }}
/>
```

### With Node Click Handler

Handle node clicks for navigation or detail views:

```tsx
<OrgChart
  data={orgData}
  onNodeClick={(nodeData) => {
    console.log("Node clicked:", nodeData);
    // Navigate to detail page, show modal, etc.
  }}
/>
```

### Disable Search

If you don't need search functionality:

```tsx
<OrgChart data={orgData} searchable={false} />
```

### Custom Search Field

Search in a different field:

```tsx
<OrgChart
  data={orgData}
  searchField="email" // Search by email instead of name
/>
```

## 📚 API Reference

### OrgChart Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `object` | **required** | The root node data object with hierarchical structure |
| `theme` | `Partial<OrgChartTheme>` | `defaultTheme` | Custom theme configuration |
| `fieldMapping` | `Partial<OrgChartFieldMapping>` | `defaultFieldMapping` | Field name mappings for title, subtitle, photo |
| `onNodeClick` | `(nodeData: any) => void` | `undefined` | Callback when a node is clicked |
| `searchable` | `boolean` | `true` | Enable/disable search functionality |
| `searchField` | `string` | `"name"` | Field name to search in (defaults to title field) |
| `searchBarStyle` | `React.CSSProperties` | `undefined` | Custom styles for search bar container |
| `searchInputStyle` | `React.CSSProperties` | `undefined` | Custom styles for search input |
| `zoomControlsStyle` | `React.CSSProperties` | `undefined` | Custom styles for zoom controls container |
| `zoomButtonStyle` | `React.CSSProperties` | `undefined` | Custom styles for zoom buttons |

### Data Structure

The component expects a hierarchical data structure:

```typescript
interface NodeData {
  [titleField]: string;      // e.g., "name" - The node's title
  [subtitleField]: string;    // e.g., "role" - The node's subtitle
  [photoField]?: string;      // e.g., "photo" - Optional image URL or base64
  children?: NodeData[];       // Optional array of child nodes
}
```

**Example:**
```tsx
const data = {
  name: "John Doe",
  role: "CEO",
  photo: "https://example.com/john.jpg",
  children: [
    {
      name: "Jane Smith",
      role: "CTO",
      children: [
        { name: "Bob Johnson", role: "Developer" },
      ],
    },
  ],
};
```

## 🎨 Customization

### Theme Structure

The theme object allows you to customize every aspect of the chart:

```typescript
interface OrgChartTheme {
  container: {
    backgroundColor: string;
    width: string | number;
    height: string | number;
  };
  nodeCard: {
    width: number;
    height: number;
    padding: number;
    borderRadius: number;
    backgroundColor: string;
    fontFamily: string;
  };
  avatar: {
    size: number;
    borderRadius: string | number;
    backgroundColor: string;
    marginBottom: number;
  };
  text: {
    name: {
      fontSize: number;
      fontWeight: number;
      color: string;
    };
    role: {
      fontSize: number;
      color: string;
      opacity: number;
    };
  };
  links: {
    strokeColor: string;
    strokeWidth: number;
    verticalSpacing: number;
  };
  layout: {
    verticalSpacing: number;
    horizontalSpacing: number;
    topMargin: number;
  };
  highlight: {
    borderColor: string;
    borderWidth: number;
  };
  searchBar: {
    top: string;
    right: string;
    width: string;
    padding: string;
    borderRadius: string;
    border: string;
    boxShadow: string;
    fontSize: string;
  };
  zoomControls: {
    top: string;
    left: string;
    buttonSize: string;
    borderRadius: string;
    backgroundColor: string;
    color: string;
    border: string;
    boxShadow: string;
    fontSize: string;
    fontWeight: string;
  };
}
```

### Field Mapping

The `fieldMapping` prop allows you to map your data structure to the component's expected fields:

```typescript
interface OrgChartFieldMapping {
  title: string;    // Default: "name"
  subtitle: string; // Default: "role"
  photo: string;    // Default: "photo"
}
```

## 🧩 Standalone Components

### ZoomControls

Use the zoom controls component independently:

```tsx
import { ZoomControls } from "react-org-chart";

function CustomControls() {
  const handleZoomIn = () => {
    // Your zoom in logic
  };

  const handleZoomOut = () => {
    // Your zoom out logic
  };

  return (
    <ZoomControls
      onZoomIn={handleZoomIn}
      onZoomOut={handleZoomOut}
      zoomInLabel="+"
      zoomOutLabel="−"
      style={{ top: "20px", left: "20px" }}
      buttonStyle={{ width: "40px", height: "40px" }}
    />
  );
}
```

### SearchBar

Use the search bar component with autocomplete:

```tsx
import { SearchBar } from "react-org-chart";

function CustomSearch() {
  const [query, setQuery] = useState("");
  const suggestions = ["John Doe", "Jane Smith", "Bob Johnson"];

  return (
    <SearchBar
      value={query}
      onChange={setQuery}
      suggestions={suggestions}
      onSelectSuggestion={(suggestion) => {
        setQuery(suggestion);
        // Handle selection
      }}
      placeholder="Search employees..."
      maxSuggestions={10}
    />
  );
}
```

## 🖼️ Image Support

The component supports both regular image URLs and base64 encoded images:

```tsx
// Regular URL
const data = {
  name: "John Doe",
  photo: "https://example.com/photo.jpg",
};

// Base64 image
const data = {
  name: "John Doe",
  photo: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
};

// If no photo is provided, initials will be displayed
const data = {
  name: "John Doe",
  role: "CEO",
  // No photo field - will show "JD" initials
};
```

## 🔍 Search Features

The search functionality includes:

- **Autocomplete**: Shows suggestions as you type
- **Keyboard Navigation**: 
  - `↑` / `↓` - Navigate suggestions
  - `Enter` - Select suggestion
  - `Escape` - Close suggestions
- **Auto-expand**: Automatically expands collapsed branches to reveal searched nodes
- **Highlight**: Highlights the found node with a customizable border
- **Smooth Pan**: Smoothly pans to the found node with animation
- **Case-insensitive**: Exact matching without case sensitivity
- **Reset on Clear**: Returns to initial position when search is cleared

## 🎯 Best Practices

1. **Performance**: For large datasets, consider lazy loading or pagination
2. **Accessibility**: Ensure your data includes meaningful titles and subtitles
3. **Images**: Use optimized images or consider lazy loading for better performance
4. **Theme**: Create a consistent theme that matches your application's design system
5. **Field Mapping**: Use field mapping to adapt to your existing data structure

## 🧪 Playground / Development

This repository includes a playground application for testing and development. The playground is located in the `playground/vite-app` directory and provides a live environment to test the library with various configurations and data structures.

### Running the Playground

1. **Install dependencies** (if not already installed):
   ```bash
   npm install
   ```

2. **Navigate to the playground directory**:
   ```bash
   cd playground/vite-app
   ```

3. **Install playground dependencies**:
   ```bash
   npm install
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser** to the URL shown in the terminal (typically `http://localhost:5173`)

The playground uses the local version of the library via npm link, so any changes you make to the library source code will be reflected immediately in the playground.

### Playground Features

- Live testing of the OrgChart component
- Example data structures and configurations
- Theme customization examples
- Search functionality testing
- Zoom and pan interactions
- Node expansion/collapse testing

This is perfect for:
- Testing new features before publishing
- Experimenting with different data structures
- Customizing themes and styles
- Debugging issues
- Demonstrating the library's capabilities

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

**Note:** Before submitting a PR, please test your changes in the playground application to ensure everything works correctly.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Gayan Prasanna**

## 🙏 Acknowledgments

- Built with [React](https://reactjs.org/)
- Powered by [D3.js](https://d3js.org/) for layout calculations
- Styled with modern CSS

---

Made with ❤️ for the React community
