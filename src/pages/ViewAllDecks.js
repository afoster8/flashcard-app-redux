import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./ViewAllDecks.css";
import { downloadJson, downloadTxt } from "../components/Download";

/* ViewAllDecks Page
   Shows all of the decks in the user's deck list
   This is how you get to the Flashcards, edit deck, download deck pages */
const ViewAllDecks = () => {
  const [decks, setDecks] = useState([]);
  const [selectedDeck, setSelectedDeck] = useState();
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [error, setError] = useState(""); // flag to tell user about errors

  /* Use Effect -- triggers on page load */
  useEffect(() => {
    setError("");

    /* Fetch decks from db */
    const fetchDecks = async () => {

      /* GET all of the decks from the user deck field */
      try {
        const response = await fetch("http://localhost:3001/auth/get-decks", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          credentials: "include",
        });

        /* If everything looks good, update our state variable appropriately */
        if (response.ok) {
          const data = await response.json();
          setDecks(data.decks);
          setError("");

        } else {
          console.error("Error fetching decks");
          setError("Something went wrong");
        }
      } catch (error) {
        console.error("Error fetching decks", error);
        setError("Something went wrong");

      }
    };

    fetchDecks();
    fetchFolders();
  }, []);


  /* if the deck hasn't loaded from UseEffect yet, we're still loading*/
  if (!decks) {
    return <p>Loading decks...</p>;
  }


  /* fetches the user folders */
  const fetchFolders = async () => {
    try {
      const response = await fetch("http://localhost:3001/auth/get-folders", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setFolders(data);
      } else {
        setError("Error fetching folders");
      }
    } catch (error) {
      setError("Error fetching folders");
    }
  };

  /* Main logic of the page -- shows decks based on folder filtering logic 
  or all decks, depending on user choice. Edit/download/start flashcards only shows when deck is selected by user*/
  const showAllDecks = () => {

    const filteredDecks = selectedFolder
      ? decks.filter((deck) => deck.folder.includes(selectedFolder))
      : decks;

    if (filteredDecks.length === 0) {
      return <p>No decks found.</p>;
    }

    /* Populate the list of decks */
    return (
      <div className="deck-list">
        {filteredDecks.map((deck) => (
          <div
            key={deck.id}
            id={`deck-${deck.id}`}
            className={`deck-item`}
            onClick={() => handleDeckClick(deck)}
          >

            <h3>{deck.name}</h3>

            {selectedDeck === deck && (
              <div className="deck-item-button-container">
                <Link to={`/start-flashcards/${deck.id}`}>
                  <button className="flashcards-button">
                    Start Flashcards
                  </button>
                </Link>
                <Link to={`/edit-deck/${selectedDeck.id}`}>
                  <button className="deck-buttons">
                    Edit Deck
                  </button>
                </Link>

                <div className="download-buttons-container">
                  <button className="download-buttons" onClick={(e) => handleDownload(e, "json")}>
                    Download as JSON
                  </button>
                  <button className="download-buttons" onClick={(e) => handleDownload(e, "txt")}>
                    Download as TSV
                  </button>
                </div>

              </div>
            )}


          </div>
        ))}
      </div>
    );
  };



  /* Page event functions */

  /* Triggers when user clicks on a deck 
     Marks that deck as selected. Used for conditional CSS element display
     of flashcard, edit deck, and download buttons for navigation
     to deck pages */
  const handleDeckClick = (deck) => {
    const deckElement = document.getElementById(`deck-${deck.id}`);

    /* toggle off selection if it is already selected*/
    if (selectedDeck) {
      const selectedDeckElement = document.getElementById(`deck-${selectedDeck.id}`);
      selectedDeckElement.classList.remove('selected');
    }

    /* otherwise mark as selected */
    setSelectedDeck(selectedDeck === deck ? null : deck);
    deckElement.classList.toggle('selected');

  };

  /* download as either json or TSV 
     note that TSVs are in the same format as the import requires
     (i.e. \n\n\n between cards and \t between front,back)
     this allows for line breaks in cards */

  const handleDownload = (e, choice) => {
    e.stopPropagation();
    choice === "json" ? downloadJson(selectedDeck) : downloadTxt(selectedDeck);
  }

  /* selects the folder that was most recently clicked on, assigns it to state var */
  const handleFolderClick = (folderName) => {
    setSelectedFolder(folderName);
    setSelectedDeck(null);
  };

  /* Populate the page */
  return (
    <div className="page">
      <div className="view-all-decks">
        <div className="title">
          <h1>All Decks</h1>
          <div className="manage-folders-button-container">
            <Link to="/folders">
              <button className="manage-folders-button">Manage Folders</button>
            </Link>
          </div>
        </div>

        {error && <p className="error-message">{error}</p>}

        <div className="folder-buttons-container">
          <button className="folder-buttons" onClick={() => handleFolderClick(null)}>All</button>

          {folders.map((folder) => (
            <button className="folder-buttons" key={folder} onClick={() => handleFolderClick(folder)}>
              {folder}
            </button>
          ))}
        </div>

        <div className="deck-container">{showAllDecks()}</div>
      </div>
    </div>
  );
};

export default ViewAllDecks;
