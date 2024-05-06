import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Chart from "chart.js/auto";
import { useNavigate } from "react-router-dom";
import * as d3 from "d3";
import D3PieChart from "./D3PieChart";
import BarChart from "./BarChart";
import { useAuthContext } from '../AuthContext/AuthContext';

export default function DashboardPage() {

  const navigate = useNavigate();
  const { authState, setAuthState } = useAuthContext();
  const [ budgetData, setBudgetData ] = useState({

  })

  const logout = () => {
    const token = localStorage.getItem('jwt')
    axios.get(
      "http://localhost:3001/logout",
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    ).then(res => {
      console.log("logged out user from BE")
      localStorage.removeItem('jwt')
      localStorage.removeItem('refreshToken')
      setAuthState({expiresAt: null, isAuthenticated: false, tokenAboutToExpire: false})
      console.log("logged out user from FE")
      navigate("/");
    })
  }

  const addBudgets = () => {
    navigate("/ConfigureBudget");
  }
   //Accessibility 
  const chartRef = useRef();

  useEffect(() => {
    let chartInstance = null
    const token = localStorage.getItem('jwt')
    console.log("got token to fetch budgets: ", token)
    console.log("fetch buckets-- auth state: ", authState)
    if (authState.isAuthenticated && !!token) {
      let dataSourceRef = {
          datasets: [
            {
              data: [],
              backgroundColor: [],
            },
          ],
          labels: [],
      }

      chartInstance = axios.get(
        "http://localhost:3001/budget",
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      ).then(res => {
        if (res.data) {
          setBudgetData(res.data)
          for (var i = 0; i < res.data.length; i++) {
            dataSourceRef.datasets[0].data[i] = res.data[i].budget;
            dataSourceRef.datasets[0].backgroundColor[i] = res.data[i].color;
            dataSourceRef.labels[i] = res.data[i].title;
          }
          const chartContext = chartRef.current.getContext("2d");
          return new Chart(chartContext, {
              type: "pie",
              data: dataSourceRef,
          });
        }
      })
    } else {
      console.log("user not authenticated")
      logout()
    }

    return () => {
      if (chartInstance) { chartInstance.then(instance => instance.destroy()) };
    };
  }, []);

  return (
    <main className="center" id="main">
      <div className="page-area">
        <section>
          <article>
            <h1> Pie Chart</h1>
            <p>
              <canvas ref={chartRef} />
            </p>

            <h1>D3 Chart</h1>
            <D3PieChart data={budgetData}/>
            <h1>Bar Chart</h1>
            <BarChart data={budgetData}/>
          </article>
        </section>
      </div>
      <div className = "row">
        <button onClick={addBudgets}>Add Budgets</button>
      </div>
      <div className = "row">
      {/* //Accessibility  */}
        <button id="logout" onClick={logout}>Logout</button>
      </div>
    </main>
  );
}