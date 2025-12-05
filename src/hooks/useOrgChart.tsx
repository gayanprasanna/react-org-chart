import { useEffect } from "react";
import * as d3 from "d3";

interface UseOrgChartProps {
  svgRef: React.RefObject<SVGSVGElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  wrapperRef: React.MutableRefObject<any>;
  data: any;
  setNodes: (nodes: any[]) => void;
  setLinks: (links: any[]) => void;
  setTransform: (transform: { x: number; y: number; k: number }) => void;
}

export function useOrgChart({
  svgRef,
  containerRef,
  wrapperRef,
  data,
  setNodes,
  setLinks,
  setTransform,
}: UseOrgChartProps) {
  useEffect(() => {
    if (!data || !svgRef.current || !containerRef.current) {
      return;
    }
    // For top-down layout: dx is vertical spacing, dy is horizontal spacing
    const dx = 200; // Vertical spacing (top to bottom)
    const dy = 200; // Horizontal spacing (left to right)

    const root = d3.hierarchy(data) as any;
    root.x0 = 0;
    root.y0 = 0;

    root?.children?.forEach(collapse);

    function collapse(d: any) {
      if (d.children) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = null;
      }
    }

    const tree = d3.tree().nodeSize([dx, dy]);
    const svg = d3.select(svgRef.current);

    // Clear previous content
    svg.selectAll("*").remove();

    let initialTransformSet = false;

    function update(source: any) {
      const nodes = source.descendants();
      const links = source.links();

      tree(source);

      // Swap x and y for top-down layout
      // In D3 tree: x is depth (vertical), y is breadth (horizontal)
      // For top-down: we want y to be vertical (top), x to be horizontal (left)
      nodes.forEach((d: any) => {
        const temp = Number(d.x) || 0;
        d.x = Number(d.y) || 0; // x becomes horizontal position
        d.y = temp; // y becomes vertical position (top-down)
      });

      links.forEach((link: any) => {
        const tempSourceX = Number(link.source.x) || 0;
        const tempSourceY = Number(link.source.y) || 0;
        link.source.x = tempSourceY;
        link.source.y = tempSourceX;

        const tempTargetX = Number(link.target.x) || 0;
        const tempTargetY = Number(link.target.y) || 0;
        link.target.x = tempTargetY;
        link.target.y = tempTargetX;
      });

      // Calculate bounds to center the tree (after swap)
      // Account for card dimensions (140px width, 140px height)
      const cardWidth = 140;
      const cardHeight = 140;

      const nodeXValues = nodes.map((d: any) => Number(d.x) || 0);
      const nodeYValues = nodes.map((d: any) => Number(d.y) || 0);

      const bounds = {
        left: Math.min(...nodeXValues),
        right: Math.max(...nodeXValues) + cardWidth,
        top: Math.min(...nodeYValues),
        bottom: Math.max(...nodeYValues) + cardHeight,
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

        const container = d3.select(containerRef.current);
        container.call(zoom as any);

        // Set initial transform on zoom to position at top center
        const initialTransform = d3.zoomIdentity
          .translate(translateX, translateY)
          .scale(scale);
        container.call(zoom.transform as any, initialTransform);

        // Also set the state to ensure React updates
        setTransform({ x: translateX, y: translateY, k: scale });
        initialTransformSet = true;
      }

      setNodes([...nodes]);
      setLinks([...links]);

      nodes.forEach((d: any) => {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    }

    update(root);

    const toggleNode = (d: any) => {
      if (d.children) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
      // Always update from root to show entire tree
      update(root);
    };

    wrapperRef.current = { toggleNode };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, svgRef, containerRef, setNodes, setLinks, setTransform]);
}
