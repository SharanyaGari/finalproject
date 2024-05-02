// import {Chart as ChartJS,
// BarElement,
// } from chartJS;

import { Tooltip } from "bootstrap";
import axios from "axios";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
} from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import { useEffect, useState } from "react";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  // Tooltip,
  Legend
);

function BarChart() {
  const [data, setData] = useState({
    labels: [],
    datasets: []
  })
  const [options, setOptions] = useState({});
  function isTokenExpired(token) {
    const expiry = JSON.parse(atob(token.split(".")[1])).exp;
    return Math.floor(new Date().getTime() / 1000) >= expiry;
  }

  const token = localStorage.getItem("jwt");
  //   console.log("got token to fetch budgets in bar: ", token);

  useEffect(() => {
    if (token && !isTokenExpired(token)) {
      const labels = [];
      const expectedExpense = [];
      const actualSpent = [];

      axios
        .get("http://localhost:3001/budget", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(function (res) {
           console.log("dat of bar", res)
          for (var i = 0; i < res.data.length; i++) {
            expectedExpense[i] = res.data[i].budget;
            actualSpent[i] = res.data[i].actualSpent;
            // actualExpense[i] = res.data[i].color;
            labels[i] = res.data[i].title;
          }
          console.log("ActualSpent", actualSpent);
          setData(data => ({
            labels,
            datasets: [
              {
                label: "Expected Budget",
                data: expectedExpense,
                backgroundColor: "aqua",
                borderColor: "black",
                borderWidth: 1,
              },
              {
                label: "Actually Spent",
                data: actualSpent,
                backgroundColor: "blue",
                borderColor: "black",
                borderWidth: 1,
              },
            ],
          }));
        });

    } else {
      console.log("no token found or token expired")
      //logout()
    }
  }, []);

  return (
    <div>
      <Bar data={data} options={options}></Bar>
    </div>
  );
}

export default BarChart;
