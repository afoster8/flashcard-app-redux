import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

/* Login page 
    Use this page to get a token that keeps you logged in. 
    Propogates your login status back to index.js */
const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState(""); // flag to show errors to user
  const navigate = useNavigate();

  /* Triggers upon hitting login button. 
      Main logic of the page -- keeps track of the username and pin you entered
      and queries the db to see if there's a match */
  const handleLogin = async () => {
    setError("");

    try {
      if (!username || !pin) {
        setError("Enter a username and password.");
        return;
      }

      /* query with your input */
      const response = await axios.post("http://localhost:3001/auth/login", {
        username,
        pin,
      });

      /* if there's a response, send it back to index.js */
      const { token } = response.data;
      onLogin(token);

      /* populate localstorage with your token and username*/
      localStorage.setItem("token", token);
      localStorage.setItem("username", username);

      /* and go back home! */
      navigate("/");
      console.log("Login success!");

    } catch (error) {
      if (error.response.data) {
        console.error(error);
        setError(error.response.data.error);
      } else {
        console.error(error);
        setError("An error occurred. Please try again.");
      }
    }
  };

  /* Move down the input fields with enter */
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {

      if (e.target.name === "username") {
        document.getElementById("pin-input").focus();

      } else if (e.target.name === "pin") {
        handleLogin();
      }
    }
  };

  return (
    <div className="page">
      <div className="login">
        <h1>Login</h1>
        {error && <p className="error-message">{error}</p>}

        <div className="user-info">
          <div className="username">
            <input
              className="username-input"
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyDown}
              name="username"
            />
          </div>

          <div className="pin">
            <input
              id="pin-input"
              className="password-input"
              type="password"
              placeholder="pin"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              onKeyDown={handleKeyDown}
              name="pin"
            />
          </div>
        </div>

        <div className="button-container">
          <button className="submit-button" onClick={handleLogin}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
