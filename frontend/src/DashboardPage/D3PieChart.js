import React, { useEffect, useRef, useState } from "react";

import * as d3 from "d3";

function D3PieChart(props) {
  const svgRef = useRef();
  useEffect(() => {
    const budgetData = props.data;
    const w = 300;
    const h = 300;
    const radius = w / 2;
    const arc = d3.arc().innerRadius(50).outerRadius(radius);
    let dataSource = {
      property: [],
      value: [],
      backgroundColor: [],
    };
    if (budgetData) {
      for (var i = 0; i < budgetData.length; i++) {
        dataSource.property[i] = budgetData[i].title;
        dataSource.value[i] = budgetData[i].budget;
        dataSource.backgroundColor[i] = budgetData[i].color;
      }

      const backgroundClr = dataSource.backgroundColor;
      const colorScale = d3.scaleOrdinal(backgroundClr);
      const formattedData = d3.pie().value((d) => d)(dataSource.value);
      const currentSvg = svgRef.current;
      const svg = d3
        .select(currentSvg)
        .attr("width", w)
        .attr("height", w)
        .append("g")
        .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");
      svg
        .selectAll()
        .data(formattedData)
        .join("path")
        .attr("d", arc)
        .style("fill", (d, i) => colorScale(i))

        .style("opacity", "0.7");
    }
  }, [props]);

  return (
    <div>
      <svg ref={svgRef}></svg>
    </div>
  );
}

export default D3PieChart;
