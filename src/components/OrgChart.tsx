import { useRef, useState, useMemo, useEffect } from "react";
import { useOrgChart } from "../hooks/useOrgChart";
import NodeCard from "./NodeCard";
import ZoomControls from "./ZoomControls";
import SearchBar from "./SearchBar";
import {
  OrgChartTheme,
  defaultTheme,
  OrgChartFieldMapping,
  defaultFieldMapping,
} from "../types";
import "./orgchart.css";

interface OrgChartWrapper {
  toggleNode: (node: any) => void;
}

interface OrgChartProps {
  data: any;
  theme?: Partial<OrgChartTheme>;
  fieldMapping?: Partial<OrgChartFieldMapping>;
  onNodeClick?: (nodeData: any) => void;
  searchable?: boolean;
  searchField?: string; // Field name to search in (defaults to title field)
  searchBarStyle?: React.CSSProperties;
  searchInputStyle?: React.CSSProperties;
  zoomControlsStyle?: React.CSSProperties;
  zoomButtonStyle?: React.CSSProperties;
}

const OrgChart = ({
  data,
  theme,
  fieldMapping,
  onNodeClick,
  searchable = true,
  searchField,
  searchBarStyle,
  searchInputStyle,
  zoomControlsStyle,
  zoomButtonStyle,
}: OrgChartProps) => {
  // Merge provided theme with defaults - memoize to prevent infinite loops
  const mergedTheme: OrgChartTheme = useMemo(
    () => ({
      nodeCard: { ...defaultTheme.nodeCard, ...theme?.nodeCard },
      avatar: { ...defaultTheme.avatar, ...theme?.avatar },
      initials: { ...defaultTheme.initials, ...theme?.initials },
      text: {
        name: { ...defaultTheme.text.name, ...theme?.text?.name },
        role: { ...defaultTheme.text.role, ...theme?.text?.role },
      },
      links: { ...defaultTheme.links, ...theme?.links },
      container: { ...defaultTheme.container, ...theme?.container },
      layout: { ...defaultTheme.layout, ...theme?.layout },
      highlight: { ...defaultTheme.highlight, ...theme?.highlight },
    }),
    [theme]
  );
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const wrapperRef = useRef<OrgChartWrapper | null>(null);

  const [nodes, setNodes] = useState<any[]>([]);
  const [links, setLinks] = useState<any[]>([]);
  const [transform, setTransform] = useState({ x: 0, y: 0, k: 1 });
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedNode, setHighlightedNode] = useState<any>(null);
  const [pendingSearchNode, setPendingSearchNode] = useState<any>(null);
  const zoomRef = useRef<{
    zoomIn: () => void;
    zoomOut: () => void;
    zoomToNode: (node: any) => void;
    resetToInitial: () => void;
    expandToNode: (nodeData: any) => boolean;
    searchAndExpand: (query: string, searchField: string) => any | null;
  } | null>(null);

  useOrgChart({
    svgRef,
    containerRef,
    wrapperRef,
    data,
    setNodes,
    setLinks,
    setTransform,
    theme: mergedTheme,
    zoomRef,
  });

  const fields = { ...defaultFieldMapping, ...fieldMapping };
  const searchFieldName =
    searchable !== false ? searchField || fields.title : null;

  // Generate suggestions from all nodes (including collapsed ones)
  const searchSuggestions = useMemo(() => {
    if (!searchFieldName) return [];

    // Get unique values from all nodes (visible and in hierarchy)
    const suggestionsSet = new Set<string>();

    // Add suggestions from visible nodes
    nodes.forEach((node: any) => {
      const fieldValue = node.data?.[searchFieldName];
      if (fieldValue && typeof fieldValue === "string" && fieldValue.trim()) {
        suggestionsSet.add(fieldValue.trim());
      }
    });

    // Also search in full data hierarchy for collapsed nodes
    const collectFromData = (node: any) => {
      if (node[searchFieldName] && typeof node[searchFieldName] === "string") {
        const value = node[searchFieldName].trim();
        if (value) {
          suggestionsSet.add(value);
        }
      }
      if (node.children && Array.isArray(node.children)) {
        node.children.forEach(collectFromData);
      }
    };
    collectFromData(data);

    return Array.from(suggestionsSet).sort();
  }, [nodes, searchFieldName, data]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim() || !searchFieldName) {
      setHighlightedNode(null);
      // Reset to initial position when search is cleared
      if (zoomRef.current) {
        zoomRef.current.resetToInitial();
      }
      return;
    }

    // First, try to find node in currently visible nodes
    // Exact match (case-insensitive)
    const foundNode = nodes.find((node: any) => {
      const fieldValue = node.data[searchFieldName];
      if (!fieldValue) return false;
      return String(fieldValue).toLowerCase() === query.toLowerCase().trim();
    });

    // If not found in visible nodes, search in full hierarchy (including collapsed)
    // and expand to it
    if (!foundNode && zoomRef.current && zoomRef.current.searchAndExpand) {
      const foundData = zoomRef.current.searchAndExpand(query, searchFieldName);
      if (foundData) {
        // Set pending search node - will be processed after nodes update
        setPendingSearchNode(foundData);
        return;
      }
    }

    if (foundNode) {
      setHighlightedNode(foundNode.data);
      // Pan to the found node smoothly
      if (zoomRef.current) {
        zoomRef.current.zoomToNode(foundNode.data);
      }
    } else {
      setHighlightedNode(null);
      // Reset to initial position when no match is found
      if (zoomRef.current) {
        zoomRef.current.resetToInitial();
      }
    }
  };

  // Handle pending search after nodes update (after expansion)
  useEffect(() => {
    if (pendingSearchNode && nodes.length > 0) {
      // Use setTimeout to defer state updates and avoid cascading renders
      // Increase delay to ensure tree has fully updated
      const timeoutId = setTimeout(() => {
        // Try to find the node by data reference or by matching key properties
        const updatedFoundNode = nodes.find((node: any) => {
          // First try exact reference match
          if (node.data === pendingSearchNode) return true;
          // Then try property matching
          if (node.data && pendingSearchNode) {
            const searchField = searchFieldName || fields.title;
            const nodeValue = node.data[searchField];
            const searchValue = pendingSearchNode[searchField];
            if (nodeValue && searchValue) {
              return (
                String(nodeValue).toLowerCase() ===
                String(searchValue).toLowerCase()
              );
            }
          }
          return false;
        });

        if (updatedFoundNode) {
          setHighlightedNode(updatedFoundNode.data);
          if (zoomRef.current) {
            zoomRef.current.zoomToNode(updatedFoundNode.data);
          }
          setPendingSearchNode(null);
        } else {
          // If still not found, try again after a longer delay
          // This handles cases where the tree update takes longer
          const retryTimeoutId = setTimeout(() => {
            const retryFoundNode = nodes.find((node: any) => {
              if (node.data === pendingSearchNode) return true;
              if (node.data && pendingSearchNode) {
                const searchField = searchFieldName || fields.title;
                const nodeValue = node.data[searchField];
                const searchValue = pendingSearchNode[searchField];
                if (nodeValue && searchValue) {
                  return (
                    String(nodeValue).toLowerCase() ===
                    String(searchValue).toLowerCase()
                  );
                }
              }
              return false;
            });
            if (retryFoundNode) {
              setHighlightedNode(retryFoundNode.data);
              if (zoomRef.current) {
                zoomRef.current.zoomToNode(retryFoundNode.data);
              }
            }
            setPendingSearchNode(null);
          }, 200);
          return () => clearTimeout(retryTimeoutId);
        }
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [nodes, pendingSearchNode, searchFieldName, fields.title]);

  return (
    <div
      className="orgchart-container"
      ref={containerRef}
      style={{
        backgroundColor: mergedTheme.container.backgroundColor,
        width: mergedTheme.container.width,
        height: mergedTheme.container.height,
        position: "relative",
      }}
    >
      {/* Zoom Controls - Top Left */}
      <ZoomControls
        onZoomIn={() => zoomRef.current?.zoomIn()}
        onZoomOut={() => zoomRef.current?.zoomOut()}
        style={zoomControlsStyle}
        buttonStyle={zoomButtonStyle}
      />

      {/* Search Bar - Top Right */}
      {searchable && (
        <SearchBar
          value={searchQuery}
          onChange={handleSearch}
          suggestions={searchSuggestions}
          onSelectSuggestion={(suggestion) => {
            handleSearch(suggestion);
          }}
          style={searchBarStyle}
          inputStyle={searchInputStyle}
        />
      )}
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        style={{ position: "absolute", top: 0, left: 0 }}
      />

      <div
        className="nodes-overlay"
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.k})`,
          transformOrigin: "0 0",
        }}
      >
        {nodes.length > 0 &&
          links.length > 0 &&
          (() => {
            // After swap: x is horizontal, y is vertical
            // Ensure we're using the latest node coordinates
            const nodeXs = nodes.map((n) => Number(n.x) || 0);
            const nodeYs = nodes.map((n) => Number(n.y) || 0);
            const cardWidth = mergedTheme.nodeCard.width;
            const cardHeight = mergedTheme.nodeCard.height;

            // Calculate bounds including card dimensions with padding
            const padding = 100;
            const minX = Math.min(...nodeXs) - padding;
            const minY = Math.min(...nodeYs) - padding;
            const maxX = Math.max(...nodeXs) + cardWidth + padding;
            const maxY = Math.max(...nodeYs) + cardHeight + padding;
            const width = maxX - minX;
            const height = maxY - minY;

            return (
              <svg
                key={`links-${nodes.length}-${links.length}`}
                className="links-overlay"
                style={{
                  position: "absolute",
                  top: `${minY}px`,
                  left: `${minX}px`,
                  pointerEvents: "none",
                  overflow: "visible",
                  width: `${width}px`,
                  height: `${height}px`,
                }}
              >
                {links.map((link, i) => {
                  // Ensure we're using the swapped coordinates from the node references
                  // link.source and link.target are references to nodes, so they have swapped coordinates
                  const sourceNodeX = Number(link.source.x) || 0;
                  const sourceNodeY = Number(link.source.y) || 0;
                  const targetNodeX = Number(link.target.x) || 0;
                  const targetNodeY = Number(link.target.y) || 0;

                  // Node card dimensions from theme
                  const cardCenterX = cardWidth / 2;
                  const verticalSpacing = mergedTheme.links.verticalSpacing;

                  // Source (parent) node - connect from bottom center
                  // Convert to SVG coordinates (SVG starts at minX)
                  const sourceX = sourceNodeX + cardCenterX - minX;
                  const sourceY = sourceNodeY - minY + cardHeight;

                  // Target (child) node - connect to top center
                  // Convert to SVG coordinates
                  const targetX = targetNodeX + cardCenterX - minX;
                  const targetY = targetNodeY - minY;

                  // Create boxy L-shape: down, then horizontal, then down
                  const midY = sourceY + verticalSpacing; // Vertical line extends down
                  const midY2 = targetY - verticalSpacing; // Vertical line before reaching child

                  return (
                    <path
                      key={`link-${i}-${sourceNodeX}-${sourceNodeY}-${targetNodeX}-${targetNodeY}`}
                      d={`
                        M${sourceX},${sourceY}
                        L${sourceX},${midY}
                        L${targetX},${midY}
                        L${targetX},${midY2}
                        L${targetX},${targetY}
                      `}
                      stroke={mergedTheme.links.strokeColor}
                      fill="none"
                      strokeWidth={mergedTheme.links.strokeWidth}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  );
                })}
              </svg>
            );
          })()}

        {nodes.map((node, index) => {
          // Check if this node should be highlighted
          const isHighlighted = highlightedNode
            ? node.data === highlightedNode ||
              (highlightedNode &&
                node.data &&
                Object.keys(node.data).every(
                  (key) =>
                    key === "children" ||
                    key === "_children" ||
                    String(node.data[key] || "") ===
                      String(highlightedNode[key] || "")
                ))
            : false;

          return (
            <div
              key={`node-${index}-${node.data[fields.title] || index}`}
              style={{
                position: "absolute",
                left: `${node.x}px`,
                top: `${node.y}px`,
                pointerEvents: "auto",
              }}
            >
              <NodeCard
                node={node}
                onToggle={() => wrapperRef.current?.toggleNode(node)}
                onClick={onNodeClick}
                theme={mergedTheme}
                fieldMapping={fieldMapping}
                isHighlighted={isHighlighted}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrgChart;
