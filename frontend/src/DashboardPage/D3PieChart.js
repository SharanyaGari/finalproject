import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Chart from "chart.js/auto";

import * as d3 from "d3";

function D3PieChart() {	
  const svgRef = useRef();

  useEffect(() => {
	const token = localStorage.getItem('jwt')
		const w = 300;
		const h = 300;
		const radius = w / 2;
		const arc = d3.arc().innerRadius(50).outerRadius(radius);
		let dataSource = {
			property: [],
			value: [],
			backgroundColor: [],
		}
    axios.get("http://localhost:3001/budget",
	{
		headers: {
		  'Authorization': `Bearer ${token}`
		}
	  }
	  ).then(function (res) {
        for (var i = 0; i < res.data.length; i++) {
					dataSource.property[i] = res.data[i].title;
					dataSource.value[i] = res.data[i].budget;
					dataSource.backgroundColor[i] = res.data[i].color;
        }
				
				const backgroundClr =  dataSource.backgroundColor
				// console.log("color ", dataSource)
				const colorScale = d3.scaleOrdinal(backgroundClr)

				const formattedData = d3.pie().value((d) => d)(dataSource.value);
				
				const currentSvg = svgRef.current
				// console.log("svgRef: ", svgRef.current)
				const svg = d3
					.select(currentSvg)
					.attr("width", w)
					.attr("height", w)
					.append("g")
					.attr("transform", "translate(" + w / 2 + "," + h / 2 + ")")
				svg
					.selectAll()
					.data(formattedData)
					.join("path")
					.attr("d", arc)
					.style("fill", (d,i) => colorScale(i))
					
					.style("opacity", "0.7");

    });
		
  });

  return (
    <div>
      <svg ref={svgRef}></svg>
    </div>
  );
}

export default D3PieChart;
