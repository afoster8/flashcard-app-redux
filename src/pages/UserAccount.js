import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserAccount.css";

/* User Account page 
    where the user can update their username, pin, or delete their account */
const UserAccount = ({ setLoggedIn }) => {
  var oldUsername = localStorage.getItem("username");
  const navigate = useNavigate();
  const [verification, setVerification] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPin, setNewPin] = useState("");
  const [newReenteredPin, setReenteredPin] = useState("");
  const [error, setError] = useState("");

  /* Page event functions */

  /* Triggers when we hit the delete account button. The appropriate string 
      needs to be entered first to prevent tragic accidents. */
  const handleDeleteAccount = async () => {
    setError("");

    if (verification !== "delete " + oldUsername) {
      setError("Delete verification failed. Please enter correct string.")
    } else {
      try {
        const response = await fetch("http://localhost:3001/auth/delete-account", {
          method: "DELETE",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          credentials: "include",
        });

        if (response.ok) {
          console.log("Account deleted successfully");

          localStorage.removeItem("token");
          localStorage.removeItem("username");
          setLoggedIn(false);
          setError("");
          navigate("/");

        } else {
          console.error("Bad request from server.");
          setError("Error deleting account");
        }

      } catch (error) {
        console.error(error);
        setError("Error deleting account");
      }
    }
  };

  /* Triggers when we hit update username */
  const handleUpdateUsername = async () => {
    setError("");

    if (!newUsername || !oldUsername) {
      setError("Username cannot be empty.");
    } else {
      try {
        const response = await fetch("http://localhost:3001/auth/update-username", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ newUsername, oldUsername }),
          credentials: "include",
        });

        if (response.ok) {
          setError("Account updated!");
          localStorage.setItem("username", newUsername);
          setNewUsername("");
        } else {
          console.error("Bad response from server.");
          setError("Error updating username");
        }

      } catch (error) {
        console.error("Error updating username", error);
        setError("Error updating username");
      }
    }
  };

  /* Triggers when we hit update pin. Pin and re-enter pin need to match. */
  const handleUpdatePin = async () => {
    setError("");

    if (!newPin || !newReenteredPin) {
      setError("Please fill out all PIN fields.");
    } else if (newPin !== newReenteredPin) {
      setError("New PINs do not match.");
    } else {
      try {
        const response = await fetch("http://localhost:3001/auth/update-pin", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ newPin }),
          credentials: "include",
        });

        if (response.ok) {
          console.log("PIN updated successfully");
          setError("Account updated!");
          setNewPin("");
          setReenteredPin("");

        } else {
          console.error("Bad response from server");
          setError("Error updating PIN");
        }

      } catch (error) {
        console.error("Error updating PIN", error);
        setError("Error updating PIN");
      }
    }
  };

  /* Populate the page. */
  return (
    <div className="page">
      <h1>User Account</h1>
      <p> Edit user details (like username and pin) or delete your whole account. </p>
      <br />

      {error && <p className="error-message">{error}</p>}

      <div className="update-container">
        <div className="username-container">
          <h2>Update Username</h2>
        </div>

        <input
          type="text"
          placeholder={oldUsername}
          value={newUsername}
          minLength={4}
          maxLength={30}
          onChange={(e) => setNewUsername(e.target.value)}
        />
        <button className="update-button" onClick={handleUpdateUsername}>Update Username</button>
      </div>

      <div className="update-container-pin">
        <div className="username-container">
          <h2>Update Pin</h2>
        </div>

        <div className="update-container-container">
          <input
            type="password"
            placeholder="New Pin"
            value={newPin}
            minLength={4}
            maxLength={60}
            onChange={(e) => setNewPin(e.target.value)}
          />

          <input
            type="password"
            placeholder="Re-enter New Pin"
            value={newReenteredPin}
            minLength={4}
            maxLength={60}
            onChange={(e) => setReenteredPin(e.target.value)}
          />

          <button className="update-button" onClick={handleUpdatePin}>Update Pin</button>
        </div>
      </div>

      <br /><br />

      <div className="update-container">
        <div className="username-container">
          <h2>Delete Account</h2>
        </div>

        <p> This is irreversible! Type "delete " + your username to confirm (example: delete
          this-old-account ). </p>
        <p> Remember to download all your decks before you go!</p>
        <p> If you use the TSV download option, cards are separated by five new-lines (\n\n\n\n\n)
          and front/back is separated by a tab (\t). </p>

        <input
          type="text"
          placeholder={"delete " + oldUsername}
          value={verification}
          onChange={(e) => setVerification(e.target.value)}
        />
        <button className="delete-button" onClick={handleDeleteAccount}>Delete Account</button>
      </div>
    </div>
  );
};

export default UserAccount;
