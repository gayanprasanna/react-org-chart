import { useRef, useState, useMemo } from "react";
import { useOrgChart } from "../hooks/useOrgChart";
import NodeCard from "./NodeCard";
import { OrgChartTheme, defaultTheme } from "../types";
import "./orgchart.css";

interface OrgChartWrapper {
  toggleNode: (node: any) => void;
}

interface OrgChartProps {
  data: any;
  theme?: Partial<OrgChartTheme>;
}

const OrgChart = ({ data, theme }: OrgChartProps) => {
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
    }),
    [theme]
  );
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const wrapperRef = useRef<OrgChartWrapper | null>(null);

  const [nodes, setNodes] = useState<any[]>([]);
  const [links, setLinks] = useState<any[]>([]);
  const [transform, setTransform] = useState({ x: 0, y: 0, k: 1 });

  useOrgChart({
    svgRef,
    containerRef,
    wrapperRef,
    data,
    setNodes,
    setLinks,
    setTransform,
    theme: mergedTheme,
  });

  return (
    <div
      className="orgchart-container"
      ref={containerRef}
      style={{
        backgroundColor: mergedTheme.container.backgroundColor,
        width: mergedTheme.container.width,
        height: mergedTheme.container.height,
      }}
    >
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
            const nodeXs = nodes.map((n) => Number(n.x) || 0);
            const nodeYs = nodes.map((n) => Number(n.y) || 0);
            const cardWidth = mergedTheme.nodeCard.width;
            const cardHeight = mergedTheme.nodeCard.height;

            // Calculate bounds including card dimensions
            const minX = Math.min(...nodeXs) - 100;
            const minY = Math.min(...nodeYs) - 100;
            const maxX = Math.max(...nodeXs) + cardWidth + 100;
            const maxY = Math.max(...nodeYs) + cardHeight + 100;
            const width = maxX - minX;
            const height = maxY - minY;

            return (
              <svg
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
                  // Node card dimensions from theme
                  const cardCenterX = cardWidth / 2;
                  const verticalSpacing = mergedTheme.links.verticalSpacing;

                  // Source (parent) node - connect from bottom center
                  // node.x is the left edge of the card (where the div starts)
                  // Card center is at: node.x + cardCenterX = node.x + 70
                  // Convert to SVG coordinates (SVG starts at minX): (node.x + 70) - minX
                  const sourceX = Number(link.source.x) + cardCenterX - minX;
                  const sourceY = Number(link.source.y) - minY + cardHeight;

                  // Target (child) node - connect to top center
                  // Card center is at: node.x + cardCenterX = node.x + 70
                  // Convert to SVG coordinates: (node.x + 70) - minX
                  const targetX = Number(link.target.x) + cardCenterX - minX;
                  const targetY = Number(link.target.y) - minY;

                  // Create boxy L-shape: down, then horizontal, then down
                  const midY = sourceY + verticalSpacing; // Vertical line extends down
                  const midY2 = targetY - verticalSpacing; // Vertical line before reaching child

                  return (
                    <path
                      key={i}
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

        {nodes.map((node) => (
          <div
            key={node.data.name}
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
              theme={mergedTheme}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrgChart;
