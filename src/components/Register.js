import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [reenteredPin, setReenteredPin] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      
      if (e.target.name === "username") {
        document.getElementById("pin-input").focus();

      } else if (e.target.name === "pin") {
        document.getElementById("reentered-pin-input").focus();

      } else if (e.target.name === "reenteredPin") {
        handleRegister();
      }
    }
  };

  const handleRegister = async () => {
    setError("");
    console.log("register button pressed!");

    try {
      if (!username || !pin) {
        setError("Enter a username and password.");
        return;
      } else if (username.length < 4 || username.length > 20) {
        setError("Username must be between 4 and 20 characters.");
        return;
      } else if (pin.length < 4 || pin.length > 60) {
        setError("Pin must be between 4 and 60 characters.");
        return;
      } else if (pin !== reenteredPin) {
        setError("Pins must match.");
        return;
      }

      console.log("waiting for response!");

      const response = await axios.post("http://localhost:3001/auth/register", {
        username,
        pin,
      });

      console.log(response.data.message);
      console.log("Success!");
      setError("");

      navigate("/login");

    } catch (error) {
      if (error.response.data) {
        setError(error.response.data.error);
      } else {
        console.error(error);
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="page">
      <div className="register">
        <h1> Register </h1>

        <p> Create a username and pin so you can save your cards! </p>
        {error && <p className="error-message">{error}</p>}

        <div className="user-info">
          <div className="username">
            <input
              className="username-input"
              minLength={4}
              maxLength={15}
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
              minLength={4}
              maxLength={60}
              placeholder="pin"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              onKeyDown={handleKeyDown}
              name="pin"
            />

            <br></br>

            <input
              id="reentered-pin-input"
              className="password-input"
              type="password"
              minLength={4}
              maxLength={60}
              placeholder="re-enter pin"
              value={reenteredPin}
              onChange={(e) => setReenteredPin(e.target.value)}
              onKeyDown={handleKeyDown}
              name="reenteredPin"
            />
          </div>
        </div>

        <div className="button-container">
          <button className="submit-button" onClick={handleRegister}>
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
