import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./ViewAllDecks.css";

/* ViewAllDecks Page
   Shows all of the decks in the user's deck list
   This is how you get to the Flashcards, edit deck, download deck pages */
const ViewAllDecks = () => {
  const [decks, setDecks] = useState([]);
  const [selectedDeck, setSelectedDeck] = useState();
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
  }, []);



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

  /* if the deck hasn't loaded from UseEffect yet, we're still loading*/
  if (!decks) {
    return <p>Loading decks...</p>;
  }

  /* Show all the decks in the user's account */
  const showAllDecks = () => {

    if (decks.length === 0) {
      return <p>No decks found.</p>;
    }

    /* Populate the list of decks */
    return (
      <div className="deck-list">
        {decks.map((deck) => (
          <div
            key={deck.id}
            id={`deck-${deck.id}`}
            className={`deck-item`}
            onClick={() => handleDeckClick(deck)}
          >

            <h3>{deck.name}</h3>

            {selectedDeck === deck && (
              <div class="deck-item-button-container">
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

                <Link to={`/download-deck/${selectedDeck.id}`}>
                  <button className="deck-buttons">
                    Download Deck
                  </button>
                </Link>
              </div>
            )}


          </div>
        ))}
      </div>
    );
  };

  /* Populate the page */
  return (
    <div className="page">
      <div className="view-all-decks">
        <h1>All Decks</h1>
        {error && <p className="error-message">{error}</p>}
        <div className="deck-container">{showAllDecks()}</div>
      </div>
    </div>
  );
};

export default ViewAllDecks;
