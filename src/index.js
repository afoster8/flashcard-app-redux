import ReactDOM from "react-dom/client";
import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import ViewAllDecks from "./pages/ViewAllDecks";
import CreateNewDeck from "./pages/CreateNewDeck";
import ImportDeck from "./pages/ImportDeck";
import Login from "./components/Login";
import Register from "./components/Register";
import NoPage from "./pages/NoPage";
import Download from "./pages/Download";
import EditDeck from "./pages/EditDeck"; 
import Flashcards from "./pages/Flashcards";
import "./index.css";

/* it all starts from here */

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false); // flag to send to Layout

  const handleLogin = () => {
    console.log("Logging in...");
    setLoggedIn(true);
  };
  
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Layout loggedIn={loggedIn} setLoggedIn={setLoggedIn} />}
        >
          <Route index element={<Home loggedIn={loggedIn} />} />
          <Route path="view-all-decks" element={<ViewAllDecks />} />
          <Route path="/download-deck/:id" element={<Download />} />
          <Route path="/edit-deck/:id" element={<EditDeck />} />
          <Route path="/start-flashcards/:id" element={<Flashcards />} />
          <Route path="create-new-deck" element={<CreateNewDeck />} />
          <Route path="import-deck" element={<ImportDeck />} />
          <Route path="login" element={<Login onLogin={handleLogin} />} />
          <Route path="register" element={<Register />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
