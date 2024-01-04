import ReactDOM from "react-dom/client";
import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

/* component imports */
import Sidebar from "./components/Sidebar";
import Home from "./routes/Home";
import ViewAllDecks from "./routes/ViewAllDecks";
import CreateNewDeck from "./routes/CreateNewDeck";
import ImportDeck from "./routes/ImportDeck";
import Login from "./routes/Login";
import Register from "./routes/Register";
import NoPage from "./routes/NoPage";
import EditDeck from "./routes/EditDeck";
import Flashcards from "./routes/Flashcards";
import Folders from "./routes/Folders";
import UserAccount from "./routes/UserAccount";
import "./index.css";

/* it all starts from here */

export default function App() {
  // flag to send to elements that require state update depending on logged-in status
  const [loggedIn, setLoggedIn] = useState(false);
  // flag to send to elements that are navigated to, to show user state change (like deck elements)
  const [updatedUser, setUpdatedUser] = useState(false);

  const handleLogin = () => {
    console.log("Logging in...");
    setLoggedIn(true);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Sidebar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />}>
          <Route index element={<Home loggedIn={loggedIn} />} />
          <Route path="view-all-decks" element={<ViewAllDecks updatedUser={updatedUser} setUpdatedUser={setUpdatedUser} />} />
          <Route path="folders" element={<Folders />} />
          <Route path="edit-deck/:id" element={<EditDeck setUpdatedUser={setUpdatedUser} />} />
          <Route path="start-flashcards/:id" element={<Flashcards />} />
          <Route path="create-new-deck" element={<CreateNewDeck />} />
          <Route path="import-deck" element={<ImportDeck />} />
          <Route path="login" element={<Login onLogin={handleLogin} />} />
          <Route path="register" element={<Register />} />
          <Route path="user-account" element={<UserAccount setLoggedIn={setLoggedIn} />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
