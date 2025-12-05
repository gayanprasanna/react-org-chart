import { useState } from "react";
import "./App.css";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - Direct import from source
import OrgChart from "react-org-chart/components/OrgChart";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - Direct import from source
import { defaultTheme } from "react-org-chart/types";
import orgData from "./mockData";

interface NodeData {
  name: string;
  role: string;
  photo?: string;
  children?: NodeData[];
  [key: string]: unknown;
}

function App() {
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);

  const handleNodeClick = (nodeData: NodeData) => {
    setSelectedNode(nodeData);
  };

  const customTheme = {
    container: {
      ...defaultTheme.container,
      width: "100vw",
      height: "100vh",
    },
  };

  return (
    <div className="app-container">
      <div className="chart-container">
        <OrgChart
          data={orgData}
          theme={customTheme}
          onNodeClick={handleNodeClick}
          searchable={true}
        />
      </div>

      {selectedNode && (
        <aside className="info-panel">
          <div className="info-panel-header">
            <h2>Node Details</h2>
            <button
              className="close-button"
              onClick={() => setSelectedNode(null)}
              aria-label="Close panel"
            >
              ×
            </button>
          </div>
          <div className="info-panel-content">
            <div className="info-item">
              <label>Name:</label>
              <span>{selectedNode.name || "N/A"}</span>
            </div>
            <div className="info-item">
              <label>Role:</label>
              <span>{selectedNode.role || "N/A"}</span>
            </div>
            {selectedNode.photo && (
              <div className="info-item">
                <label>Photo:</label>
                <span className="photo-url">{selectedNode.photo}</span>
              </div>
            )}
            <div className="info-item">
              <label>Has Children:</label>
              <span>
                {selectedNode.children && selectedNode.children.length > 0
                  ? `Yes (${selectedNode.children.length})`
                  : "No"}
              </span>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}

export default App;
