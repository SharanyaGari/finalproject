import React, { useEffect } from "react";
import "./App.css";
import "./pb.sass";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Menu from "./Menu/Menu";
import Hero from "./Hero/Hero";
import Footer from "./Footer/Footer";
import LoginPage from "./LoginPage/LoginPage";
import HomePage from "./HomePage/HomePage";
import DashboardPage from "./DashboardPage/DashboardPage";
import SignupPage from "./SignupPage/SignupPage";
import ConfigureBudget from "./ConfigureBudget/ConfigureBudget";
import { useAuthContext } from "./AuthContext/AuthContext";

function App() {
  const { authState, setAuthState } = useAuthContext();

  const handleClose = () => {
    const token = localStorage.getItem("jwt");
    const refreshToken = localStorage.getItem("refresh_token");
    axios
      .post(
        "http://localhost:3001/refresh-token",
        { refreshToken },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        if (res && res.data && res.data.token) {
          const token = res.data.token;
          const expiresAt = res.data.expiresBy;
          console.log("got token after refresh: ", token);
          localStorage.setItem("jwt", token);
          setAuthState({
            expiresAt,
            isAuthenticated: true,
            tokenAboutToExpire: false,
          });
        }
      });
  };

  useEffect(() => {
    console.log("re-rendering app, auth state: ", authState);
    let refreshAccessTokenTimerId;

    const tokenExpiresAt = authState.expiresAt
    console.log(`app re-render: expires at: ${tokenExpiresAt}, now: ${Date.now()}, difference in seconds: ${tokenExpiresAt - Date.now()}`)

    if (authState.isAuthenticated && authState.expiresAt > Date.now() && !authState.tokenAboutToExpire) {
      refreshAccessTokenTimerId = setTimeout(() => {
        setAuthState({ ...authState, tokenAboutToExpire: true });
        console.log("timer expired, setting auth state: ", JSON.stringify(authState));
      }, tokenExpiresAt - Date.now() - 20 * 1000);
    }

    return () => {
      if (authState.isAuthenticated && refreshAccessTokenTimerId) {
        clearTimeout(refreshAccessTokenTimerId);
        console.log("clearing timer, setting auth state: ", authState);
      }
    };
  }, [authState]);

  return (
    <Router>
      <Menu />
      <Hero />
      <div className="mainContainer">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/configurebudget" element={<ConfigureBudget />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </div>
      <div
        className="modal center overlay"
        style={{ display: "block", position: "initial" }}
      >
        <Modal
          show={authState.tokenAboutToExpire}
          size="xl"
          fullscreen="md-down"
        >
          <Modal.Header>
            <Modal.Title>Session expiring</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Continue session?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Continue
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
       <Footer></Footer>
    </Router>
  );
}

export default App;
