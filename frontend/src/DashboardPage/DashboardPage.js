import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Chart from "chart.js/auto";

import * as d3 from "d3";
import D3PieChart from "./D3PieChart";

export default function DashboardPage() {

  const chartRef = useRef();

  useEffect(() => {
    let dataSourceRef = {
        datasets: [
          {
            data: [],
            backgroundColor: [],
          },
        ],
        labels: [],
    }

    let chartInstance = axios.get("http://localhost:80/budget").then(function (res) {
      for (var i = 0; i < res.data.length; i++) {
        dataSourceRef.datasets[0].data[i] = res.data[i].budget;
        dataSourceRef.datasets[0].backgroundColor[i] = res.data[i].color;
        dataSourceRef.labels[i] = res.data[i].title;
      }
      //console.log("data source ref homepage: ", dataSourceRef)
			const chartContext = chartRef.current.getContext("2d");
			return new Chart(chartContext, {
					type: "pie",
					data: dataSourceRef,
			});
    });
    return () => {
      chartInstance.then(instance => instance.destroy());
    };
  });

  return (
    <main className="center" id="main">
      <div className="page-area">
        <section>
          <article>
            <h1>Chart</h1>
            <p>
              <canvas ref={chartRef} />
            </p>

            <h1>D3 Chart</h1>
            <D3PieChart />
          </article>
        </section>
      </div>
    </main>
  );
}

// export default DashboardPage;
