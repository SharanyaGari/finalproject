import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from '../AuthContext/AuthContext';

export default function ConfigureBudget() {
  const navigate = useNavigate();
  const token = localStorage.getItem("jwt");
  const { authState, setAuthState } = useAuthContext(); 

  function submitBudgets(){
    navigate("/dashboard");

  }

  // function isTokenExpired(token) {
  //   const expiry = JSON.parse(atob(token.split(".")[1])).exp;
  //   return Math.floor(new Date().getTime() / 1000) >= expiry;
  // }

  function addBudgets() {

    const budgetData = {
      title: document.getElementById("title").value,
      budget: document.getElementById("budget").value,
      actualSpent: document.getElementById("actualSpent").value,
      color: document.getElementById("color").value,
    };
    console.log("data is", budgetData);
    console.log("got token to add budgets", token);
    axios.post(
      "http://localhost:3001/configure", 
      budgetData,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      },
    ).then((res) => {
      console.log("response for signup is", res);
          document.getElementById("title").value = ''
          document.getElementById("budget").value = ''
          document.getElementById("actualSpent").value = ''
          document.getElementById("color").value = ''
      //   window.location.href = '/ConfigureBudget'
    });
  }

  useEffect(() => {
    if (authState.isAuthenticated) {
      console.log("token expired or no token found")
      navigate("/");
    }
  });

  return (
    <div className="LPage">
      <div className="row">
        <h1>Configure your Budget</h1>
        <label>Enter Budget Title</label>
        <input type="text" name="Username" id="title"></input>
      </div>
      <div className="row">
        <label>Enter Budget Expense</label>
        <input type="text" name="budget" id="budget"></input>
      </div>
      <div className="row">
        <label>Enter Actual Spent Expense</label>
        <input type="text" name="actualSpent" id="actualSpent"></input>
      </div>
      <div className="row">
        <label>Enter Color Code</label>
        <input type="text" name="color" id="color"></input>
      </div>
      <div className="row">
        <button onClick={addBudgets}>Add</button>
      </div>
      <div className="row">
        <button onClick={submitBudgets}>Submit</button>
      </div>
    </div>
  );
}
