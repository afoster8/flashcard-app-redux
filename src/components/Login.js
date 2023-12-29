import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = ({ onLogin }) => {
    
    const [username, setUsername] = useState("");
    const [pin, setPin] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {

            if (e.target.name === "username") {
                document.getElementById("pin-input").focus();

            } else if (e.target.name === "pin") {
                handleLogin();
            }
        }
    };

    const handleLogin = async () => {
        setError("");

        try {
            if (!username || !pin) {
                setError("Enter a username and password.");
                return;
            }

            const response = await axios.post("http://localhost:3001/auth/login", {
                username,
                pin,
            });

            const { token } = response.data;
            onLogin(token);

            localStorage.setItem("token", token);
            localStorage.setItem("username", username);

            navigate("/");

            console.log(response.data);
            console.log("Login success!");

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
