import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteAccount, updateUsername, updatePin } from "../components/requestutils";
import "./UserAccount.css";

/* User Account page 
  Where the user can update their username, pin, or delete their account */

const UserAccount = ({ setLoggedIn }) => {
  var oldUsername = localStorage.getItem("username");
  const navigate = useNavigate();
  const [verification, setVerification] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPin, setNewPin] = useState("");
  const [newReenteredPin, setReenteredPin] = useState("");
  const [error, setError] = useState("");

  /* Triggered when we hit the delete account button. The appropriate string 
      needs to be entered first to prevent tragic accidents. */
  const handleDeleteAccount = async () => {
    setError("");
    deleteAccount({ setLoggedIn, setError });
    navigate("/");
  };

  /* Triggered when we hit update username */
  const handleUpdateUsername = async () => {
    setError("");
    updateUsername({ newUsername, setNewUsername, setError });
  };

  /* Triggered when we hit update pin. Pin and re-enter pin need to match. */
  const handleUpdatePin = async () => {
    setError("");
    updatePin({ newPin, setNewPin, setReenteredPin, setError });
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
