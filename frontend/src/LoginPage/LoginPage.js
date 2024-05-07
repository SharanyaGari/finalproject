import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../AuthContext/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { setAuthState } = useAuthContext();
  const serverUrl = process.env.SERVER_URL || "localhost:3001"
  const serverProtocol = process.env.SERVER_PROTOCOL || "http"

  function login() {
    const data = {
      username: document.getElementById("username").value,
      password: document.getElementById("password").value,
    };
    axios.post(`${serverProtocol}://${serverUrl}/login`, data).then((res) => {
      console.log("username is", res);
      document.getElementById("username").value = "";
      document.getElementById("password").value = "";
      if (res && res.data && res.data.token) {
        const token = res.data.token;
        const refreshToken = res.data.refreshToken;
        console.log("got token after login: ", token);
        const expiresAt = res.data.expiresBy;
        localStorage.setItem("jwt", token);
        localStorage.setItem("refresh_token", refreshToken);
        setAuthState({
          expiresAt,
          isAuthenticated: true,
          tokenAboutToExpire: false,
        });
        navigate("/dashboard");
      }
    });
  }

  return (
    //Accessibility
    <div aria-live="polite" aria-atomic="true" className="LPage">
      <div className="row">
        <label>Username</label>
        <input type="text" name="Username" id="username"></input>
      </div>
      <div className="row">
        <label>Password</label>
        <input type="text" name="Password" id="password"></input>
      </div>
      <div className="row" id="login">
        <button onClick={login}>Login</button>
      </div>
    </div>
  );
}
