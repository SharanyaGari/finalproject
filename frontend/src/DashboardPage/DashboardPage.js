import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Chart from "chart.js/auto";
import { useNavigate } from "react-router-dom";
import * as d3 from "d3";
import D3PieChart from "./D3PieChart";
import BarChart from "./BarChart";
import { useAuthContext } from '../AuthContext/AuthContext';
import LoginPopup from "../Popup/LoginPopup";

export default function DashboardPage() {

  const navigate = useNavigate();
  const { authState, setAuthState } = useAuthContext(); 

  const isTokenExpiring = authState.tokenAboutToExpire

  const logout = () => {
    setAuthState({expiresAt: null, isAuthenticated: false, tokenAboutToExpire: false})
    navigate("/");
    //window.location.href = '/'
  }

  const addBudgets = () => {
    navigate("/ConfigureBudget");
    //window.location.href = '/'
  }
   //Accessibility 
  const chartRef = useRef();

  useEffect(() => {
    const token = localStorage.getItem('jwt')
    console.log("got token to fetch budgets: ", token)
    if (authState.isAuthenticated) {
      let dataSourceRef = {
          datasets: [
            {
              data: [],
              backgroundColor: [],
            },
          ],
          labels: [],
      }

      let chartInstance = axios.get(
        "http://localhost:3001/budget",
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      ).then(function (res) {
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
    }
    else {
      console.log("no token found or token expired")
      logout()
    }
  }, []);

  return (
    // <div>
    //   { isTokenExpiring ? (
    //     <LoginPopup />
    //   ) : (
        <main className="center" id="main">
          <div className="page-area">
            <section>
              <article>
                <h1> Pie Chart</h1>
                <p>
                  <canvas ref={chartRef} />
                </p>

                <h1>D3 Chart</h1>
                <D3PieChart />
                <h1>Bar Chart</h1>
                <BarChart/>
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
        // ) }
    // </div>
  );
}

// export default DashboardPage;
