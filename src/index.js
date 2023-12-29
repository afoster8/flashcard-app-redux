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
import UserData from "./components/UserData";
import "./index.css";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = () => {
    console.log("Logging in...");
    setLoggedIn(true);
  };
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout loggedIn={ loggedIn } setLoggedIn={ setLoggedIn } />}>
          <Route index element={<Home loggedIn={ loggedIn } />} />
          <Route path="view-all-decks" element={<ViewAllDecks />} />
          <Route path="create-new-deck" element={<CreateNewDeck />} />
          <Route path="import-deck" element={<ImportDeck />} />
          <Route path="user-data" element={<UserData />} />
          <Route path="login" element={<Login onLogin={ handleLogin } />} />
          <Route path="register" element={<Register />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);