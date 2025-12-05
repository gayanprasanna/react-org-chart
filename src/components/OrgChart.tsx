import { useRef, useState } from "react";
import { useOrgChart } from "../hooks/useOrgChart";
import NodeCard from "./NodeCard";
import "./orgchart.css";
interface OrgChartWrapper {
  toggleNode: (node: any) => void;
}

const OrgChart = ({ data }: { data: any }) => {
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
  });

  return (
    <div className="orgchart-container" ref={containerRef}>
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
            const cardWidth = 140;
            // Card height: 12px padding top + 60px avatar + 8px margin + 20px name + 4px margin + 16px role + 12px padding bottom = ~132px
            // Using 140px to account for line heights and be safe
            const cardHeight = 140;

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
                  // Node card dimensions - cardWidth is 140px
                  // Card center is exactly at 70px from left edge (half of 140px)
                  const cardCenterX = cardWidth / 2; // 70px from left edge
                  const verticalSpacing = 20; // Space between parent bottom and horizontal line

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
                      stroke="#999"
                      fill="none"
                      strokeWidth="2"
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
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrgChart;
