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

function BarChart(props) {
  const [data, setData] = useState({
    labels: [],
    datasets: [],
  });
  const [options, setOptions] = useState({});

  useEffect(() => {
    const budgetData = props.data;
    if (budgetData) {
      const labels = [];
      const expectedExpense = [];
      const actualSpent = [];
      for (var i = 0; i < budgetData.length; i++) {
        expectedExpense[i] = budgetData[i].budget;
        actualSpent[i] = budgetData[i].actualSpent;
        labels[i] = budgetData[i].title;
      }
      console.log("ActualSpent", actualSpent);
      setData({
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
      });
    }
  }, [props]);

  return (
    <div>
      <Bar data={data} options={options}></Bar>
    </div>
  );
}

export default BarChart;
