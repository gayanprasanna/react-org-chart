import { useEffect, useRef } from "react";
import * as d3 from "d3";

const OrgChart = ({ data }: { data: unknown }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  useEffect(() => {
    const width = 900;
    const height = 600;

    const root = d3.hierarchy(data);
    const treeLayout = d3.tree().size([width - 200, height - 150]);
    treeLayout(root);

    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", [0, 0, width, height])
      .style("font", "10px sans-serif");

    svg.selectAll("*").remove(); // Clear previous contents

    const g = svg.append("g").attr("transform", `translate(100, 50)`);

    // Links
    g.append("g")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5)
      .selectAll("path")
      .data(root.links())
      .join("path")
      .attr(
        "d",
        d3
          .linkVertical<any, any>()
          .x((d) => d.x)
          .y((d) => d.y)
      );

    // Nodes
    const node = g
      .selectAll("g")
      .data(root.descendants())
      .enter()
      .append("g")
      .attr("transform", (d) => `translate(${d.x},${d.y})`);

    // Node circles
    node
      .append("circle")
      .attr("r", 20)
      .attr("fill", "#1976d2")
      .attr("stroke", "#fff")
      .attr("stroke-width", 3);

    // Labels
    node
      .append("text")
      .attr("dy", -30)
      .attr("x", 0)
      .style("text-anchor", "middle")
      .style("font-size", "14px")
      .text((d: any) => d.data.name);
  }, [data]);

  return <svg ref={svgRef} width="100%" height="600px"></svg>;
};

export default OrgChart;
