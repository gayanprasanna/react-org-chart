import { useEffect } from "react";
import * as d3 from "d3";
import { OrgChartTheme } from "../types";

interface UseOrgChartProps {
  svgRef: React.RefObject<SVGSVGElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  wrapperRef: React.MutableRefObject<any>;
  data: any;
  setNodes: (nodes: any[]) => void;
  setLinks: (links: any[]) => void;
  setTransform: (transform: { x: number; y: number; k: number }) => void;
  theme: OrgChartTheme;
  zoomRef?: React.MutableRefObject<{
    zoomIn: () => void;
    zoomOut: () => void;
    zoomToNode: (node: any) => void;
    resetToInitial: () => void;
    expandToNode: (nodeData: any) => boolean;
    searchAndExpand: (query: string, searchField: string) => any | null;
  } | null>;
}

export function useOrgChart({
  svgRef,
  containerRef,
  wrapperRef,
  data,
  setNodes,
  setLinks,
  setTransform,
  theme,
  zoomRef,
}: UseOrgChartProps) {
  useEffect(() => {
    if (!data || !svgRef.current || !containerRef.current) {
      return;
    }
    // For top-down layout: dx is vertical spacing, dy is horizontal spacing
    const dx = theme.layout.verticalSpacing; // Vertical spacing (top to bottom)
    const dy = theme.layout.horizontalSpacing; // Horizontal spacing (left to right)

    let hierarchyRoot: any = null;
    const root = d3.hierarchy(data) as any;
    root.x0 = 0;
    root.y0 = 0;
    hierarchyRoot = root; // Store root reference

    root?.children?.forEach(collapse);

    function collapse(d: any) {
      if (d.children) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = null;
      }
    }

    // D3 tree: nodeSize([x-spacing, y-spacing])
    // D3 tree uses: x for depth (vertical), y for breadth (horizontal)
    // We want: x for horizontal (breadth), y for vertical (depth)
    // So we swap: nodeSize([dy, dx]) where dy=horizontal, dx=vertical
    // This gives: x-spacing = dy (horizontal), y-spacing = dx (vertical)
    const tree = d3.tree().nodeSize([dy, dx]);
    const svg = d3.select(svgRef.current);

    // Clear previous content
    svg.selectAll("*").remove();

    let initialTransformSet = false;
    let currentNodesRef: any[] = [];
    let zoomInstance: d3.ZoomBehavior<HTMLDivElement, unknown> | null = null;
    let initialTransform: { x: number; y: number; k: number } | null = null;

    function update(source: any) {
      tree(source);

      const nodes = source.descendants();
      const links = source.links();

      // With nodeSize([dy, dx]), D3 tree now has:
      // x = horizontal position (breadth)
      // y = vertical position (depth)
      // This is already what we want for top-down layout, so no swap needed!
      // Just ensure coordinates are numbers
      nodes.forEach((d: any) => {
        d.x = Number(d.x) || 0;
        d.y = Number(d.y) || 0;
      });

      // Ensure link coordinates are numbers (they reference nodes, so already correct)
      links.forEach((link: any) => {
        if (link.source) {
          link.source.x = Number(link.source.x) || 0;
          link.source.y = Number(link.source.y) || 0;
        }
        if (link.target) {
          link.target.x = Number(link.target.x) || 0;
          link.target.y = Number(link.target.y) || 0;
        }
      });

      // Calculate bounds to center the tree (after swap)
      // Account for card dimensions from theme
      // Add extra buffer for multi-line text that may exceed fixed height
      const cardWidth = theme.nodeCard.width;
      const cardHeight = theme.nodeCard.height;
      const heightBuffer = 40; // Extra space for multi-line subtitles

      const nodeXValues = nodes.map((d: any) => Number(d.x) || 0);
      const nodeYValues = nodes.map((d: any) => Number(d.y) || 0);

      const bounds = {
        left: Math.min(...nodeXValues),
        right: Math.max(...nodeXValues) + cardWidth,
        top: Math.min(...nodeYValues),
        bottom: Math.max(...nodeYValues) + cardHeight + heightBuffer,
      };

      const width = containerRef.current?.clientWidth || 800;
      const height = containerRef.current?.clientHeight || 700;

      const treeWidth = bounds.right - bounds.left;
      const treeHeight = bounds.bottom - bounds.top;

      const scale = Math.min(
        (width * 0.8) / Math.max(treeWidth, 200),
        (height * 0.8) / Math.max(treeHeight, 200),
        1
      );

      // Calculate center of tree (accounting for card dimensions)
      // The center is the midpoint of the bounds
      const treeCenterX = (bounds.left + bounds.right) / 2;
      const treeTop = bounds.top;
      const topMargin = 50; // Margin from top of container

      // Position at top middle using transform
      // After scaling, the tree center will be at: treeCenterX * scale
      // To center it in container: translate by (container center - scaled tree center)
      // To position at top: translate by (top margin - scaled tree top)
      const translateX = width / 2 - treeCenterX * scale;
      const translateY = topMargin - treeTop * scale;

      // Set initial transform if not set
      if (!initialTransformSet) {
        // Setup zoom on container for drag/pan everywhere
        const zoom = d3
          .zoom<HTMLDivElement, unknown>()
          .scaleExtent([0.2, 3])
          .on("zoom", (event) => {
            const t = event.transform;
            setTransform({ x: t.x, y: t.y, k: t.k });
          });

        zoomInstance = zoom;
        const container = d3.select(containerRef.current);
        container.call(zoom as any);

        // Set initial transform on zoom to position at top center
        const initialZoomTransform = d3.zoomIdentity
          .translate(translateX, translateY)
          .scale(scale);
        container.call(zoom.transform as any, initialZoomTransform);

        // Store initial transform for reset functionality
        initialTransform = { x: translateX, y: translateY, k: scale };

        // Also set the state to ensure React updates
        setTransform({ x: translateX, y: translateY, k: scale });
        initialTransformSet = true;
      }

      setNodes([...nodes]);
      setLinks([...links]);
      currentNodesRef = [...nodes];

      nodes.forEach((d: any) => {
        d.x0 = d.x;
        d.y0 = d.y;
      });

      // Update zoom functions after nodes are set
      if (zoomRef && zoomInstance && containerRef.current) {
        zoomRef.current = {
          expandToNode: () => false, // Will be set later
          searchAndExpand: () => null, // Will be set later
          zoomIn: () => {
            if (!zoomInstance || !containerRef.current) return;
            const container = d3.select(containerRef.current);
            const currentTransform = d3.zoomTransform(containerRef.current);
            const newScale = Math.min(currentTransform.k * 1.2, 3);
            // Preserve translation when scaling
            const newTransform = d3.zoomIdentity
              .translate(currentTransform.x, currentTransform.y)
              .scale(newScale);
            // Smooth zoom transition
            container
              .transition()
              .duration(300)
              .ease(d3.easeCubicInOut)
              .call(zoomInstance.transform as any, newTransform);
          },
          zoomOut: () => {
            if (!zoomInstance || !containerRef.current) return;
            const container = d3.select(containerRef.current);
            const currentTransform = d3.zoomTransform(containerRef.current);
            const newScale = Math.max(currentTransform.k / 1.2, 0.2);
            // Preserve translation when scaling
            const newTransform = d3.zoomIdentity
              .translate(currentTransform.x, currentTransform.y)
              .scale(newScale);
            // Smooth zoom transition
            container
              .transition()
              .duration(300)
              .ease(d3.easeCubicInOut)
              .call(zoomInstance.transform as any, newTransform);
          },
          zoomToNode: (targetNode: any) => {
            if (!targetNode || !zoomInstance || !containerRef.current) return;

            // Find the node in the current nodes array
            const foundNode = currentNodesRef.find((n: any) => {
              // Compare by reference first
              if (n.data === targetNode) return true;
              // Try to match by comparing data objects
              if (n.data && targetNode) {
                // Simple comparison - check if key properties match
                const nodeKeys = Object.keys(n.data);
                const targetKeys = Object.keys(targetNode);
                if (nodeKeys.length !== targetKeys.length) return false;

                // Check if all values match (excluding children)
                return nodeKeys.every((key) => {
                  if (key === "children" || key === "_children") return true;
                  return (
                    String(n.data[key] || "") === String(targetNode[key] || "")
                  );
                });
              }
              return false;
            });

            if (!foundNode) return;

            const container = d3.select(containerRef.current);
            const width = containerRef.current.clientWidth || 800;
            const height = containerRef.current.clientHeight || 700;
            const cardWidth = theme.nodeCard.width;
            const cardHeight = theme.nodeCard.height;

            // Get current transform to preserve zoom level
            const currentTransform = d3.zoomTransform(containerRef.current);
            const currentScale = currentTransform.k;

            // Calculate node center position
            const nodeX = Number(foundNode.x) || 0;
            const nodeY = Number(foundNode.y) || 0;
            const nodeCenterX = nodeX + cardWidth / 2;
            const nodeCenterY = nodeY + cardHeight / 2;

            // Calculate transform to center the node (pan only, keep current scale)
            const translateX = width / 2 - nodeCenterX * currentScale;
            const translateY = height / 2 - nodeCenterY * currentScale;

            const newTransform = d3.zoomIdentity
              .translate(translateX, translateY)
              .scale(currentScale);

            // Use D3 transition for smooth panning
            container
              .transition()
              .duration(750)
              .ease(d3.easeCubicInOut)
              .call(zoomInstance.transform as any, newTransform);
          },
          resetToInitial: () => {
            if (!zoomInstance || !containerRef.current || !initialTransform)
              return;
            const container = d3.select(containerRef.current);
            const resetTransform = d3.zoomIdentity
              .translate(initialTransform.x, initialTransform.y)
              .scale(initialTransform.k);

            // Smooth transition back to initial position
            container
              .transition()
              .duration(750)
              .ease(d3.easeCubicInOut)
              .call(zoomInstance.transform as any, resetTransform);
          },
        };
      }
    }

    update(root);

    const toggleNode = (clickedNode: any) => {
      if (!clickedNode || !hierarchyRoot) return;

      // Find the node in the hierarchy by matching the data reference
      const findNodeInHierarchy = (node: any, targetData: any): any => {
        // Compare by data reference (should be exact match)
        if (node.data === targetData) {
          return node;
        }
        // Search in children
        if (node.children) {
          for (const child of node.children) {
            const found = findNodeInHierarchy(child, targetData);
            if (found) return found;
          }
        }
        // Search in collapsed children
        if (node._children) {
          for (const child of node._children) {
            const found = findNodeInHierarchy(child, targetData);
            if (found) return found;
          }
        }
        return null;
      };

      // Get the data from the clicked node
      const targetData = clickedNode.data || clickedNode;

      // Find the node in the hierarchy tree
      const d = findNodeInHierarchy(hierarchyRoot, targetData);

      if (!d) {
        return;
      }

      // Toggle: if expanded, collapse; if collapsed, expand
      if (d.children) {
        // Collapse: move children to _children
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = null;
      } else if (d._children) {
        // Expand: move _children back to children
        d.children = d._children;
        d._children = null;
      }

      // Always update from root to show entire tree
      update(hierarchyRoot);
    };

    const expandToNode = (targetNodeData: any): boolean => {
      if (!hierarchyRoot || !targetNodeData) return false;

      // Find the node in the hierarchy (including collapsed children)
      const findNodeInHierarchy = (node: any, targetData: any): any => {
        if (node.data === targetData) {
          return node;
        }
        // Search in expanded children
        if (node.children) {
          for (const child of node.children) {
            const found = findNodeInHierarchy(child, targetData);
            if (found) return found;
          }
        }
        // Search in collapsed children
        if (node._children) {
          for (const child of node._children) {
            const found = findNodeInHierarchy(child, targetData);
            if (found) return found;
          }
        }
        return null;
      };

      // Find the target node
      const targetNode = findNodeInHierarchy(hierarchyRoot, targetNodeData);
      if (!targetNode) return false;

      // Build path from root to target node
      const path: any[] = [];
      let current: any = targetNode;
      while (current && current !== hierarchyRoot) {
        path.unshift(current);
        current = current.parent;
      }
      path.unshift(hierarchyRoot);

      // Expand all nodes in the path (except the target itself)
      let expanded = false;
      for (let i = 0; i < path.length - 1; i++) {
        const node = path[i];
        if (node._children && !node.children) {
          // Node is collapsed, expand it
          node.children = node._children;
          node._children = null;
          expanded = true;
        }
      }

      // Update the tree if any nodes were expanded
      if (expanded) {
        update(hierarchyRoot);
      }

      return true;
    };

    const searchAndExpand = (
      query: string,
      searchField: string
    ): any | null => {
      if (!hierarchyRoot || !query.trim() || !searchField) return null;

      const trimmedQuery = query.toLowerCase().trim();

      // Search in the full hierarchy (including collapsed nodes)
      // Exact match (case-insensitive)
      // Use a more comprehensive traversal to ensure we check all branches
      const searchInHierarchy = (node: any): any => {
        if (!node) return null;

        // Check if node has data
        if (!node.data) return null;

        // Check current node first
        // Try the specified search field first
        let fieldValue = node.data[searchField];

        // If field doesn't exist or is empty, try common fields as fallback
        if (
          (fieldValue === undefined ||
            fieldValue === null ||
            fieldValue === "") &&
          node.data
        ) {
          // Try 'name' as fallback if searchField is different
          if (searchField !== "name" && node.data.name) {
            fieldValue = node.data.name;
          }
        }

        if (
          fieldValue !== undefined &&
          fieldValue !== null &&
          fieldValue !== ""
        ) {
          const normalizedValue = String(fieldValue).toLowerCase().trim();
          if (normalizedValue === trimmedQuery) {
            return node;
          }
        }

        // Search in expanded children first
        if (node.children && Array.isArray(node.children)) {
          for (const child of node.children) {
            const found = searchInHierarchy(child);
            if (found) return found;
          }
        }

        // Search in collapsed children (CRITICAL: these contain nodes when tree is collapsed)
        // When tree is initialized, all nodes except root are in _children
        if (node._children && Array.isArray(node._children)) {
          for (const child of node._children) {
            const found = searchInHierarchy(child);
            if (found) return found;
          }
        }

        return null;
      };

      // Find the node in the hierarchy starting from root
      const foundNode = searchInHierarchy(hierarchyRoot);
      if (!foundNode) {
        return null;
      }

      // Expand to the node if it's in a collapsed branch
      expandToNode(foundNode.data);

      // Return the node data
      return foundNode.data;
    };

    wrapperRef.current = { toggleNode };

    // Update zoomRef with expandToNode and searchAndExpand functions
    if (zoomRef && zoomRef.current) {
      zoomRef.current.expandToNode = expandToNode;
      zoomRef.current.searchAndExpand = searchAndExpand;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    data,
    svgRef,
    containerRef,
    setNodes,
    setLinks,
    setTransform,
    theme,
    zoomRef,
  ]);
}
