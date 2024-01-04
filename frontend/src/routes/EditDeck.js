import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchFolders, fetchDeck, saveDeck, deleteDeck } from "../components/requestutils";
import "./EditDeck.css";

/* Edit Deck page 
  We get here through the ViewAllCards page
  Associated with a specific user deck, noted by ID */

const EditDeck = ({ setUpdatedUser }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deck, setDeck] = useState(null);
  const [folders, setFolders] = useState([]);
  const [error, setError] = useState(false); // flag for successful import or some other error

  /* Use Effect -- triggers on page load 
    Fetch both the deck we're working on and the user's folders */
  useEffect(() => {
    setError("");
    fetchFolders({ setFolders, setError });
    fetchDeck({ id, setDeck, setError });
  }, [id]);

  /* Show loading screen if we're waiting on a response above */
  if (!deck) {
    return <p>Loading...</p>;
  }

  /* Triggered when we hit save
    PUTS a new deck in your user account where the old one used to be */
  const handleSaveDeck = async () => {
    setError("");
    saveDeck({ id, deck, setError });
  };

  /* Triggers when we hit delete deck. 
    DELETE deck from user's deck field */
  const handleDeleteDeck = async () => {
    setError(""); 
    deleteDeck({ id, setError });
    setUpdatedUser(true);
    navigate("/view-all-decks");
  };

  /* Triggers when we hit the add card button 
    Initiates a new card for user input, updates deck state */
  const handleAddCard = () => {
    setError("");
    setDeck({...deck, cards: [...deck.cards, { front: "", back: "", starred: false }]})
  };

  /* Triggers when we select a folder from the dropdown
    Updates deck state to be the selected folder */
  const handleAssignToFolder = (folderName) => {
    setError("");
    setDeck({ ...deck, folder: [folderName] });
  };

  /* move down the page as you hit enter 
    you do have to hit enter twice when you just added a new card */
  const handleKeyDown = (event, index) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();

      if (event.target.id === "name-input") {
        document.getElementById("front-0").focus();
      } else if (event.target.id === `back-${index}` && index === deck.cards.length - 1) {
        handleAddCard();
      } else if (event.target.id === `front-${index}`) {
        document.getElementById(`back-${index}`).focus();
      } else {
        document.getElementById(`front-${index + 1}`).focus();
      }
    }
  };

  /* Populate the page */
  return (
    <div className="page">
      <div className="create-new-deck">
        <div className="title">
          <h1>Edit Deck</h1>
          <div className="delete-deck-container">
            <button onClick={handleSaveDeck}>Save Deck</button>
            <button className="delete-deck" onClick={handleDeleteDeck}>Delete Deck</button>
          </div>
        </div>

        <div className="assign-folder-container">
          <h4>Assign to Folder: </h4>
          <select onChange={(e) => handleAssignToFolder(e.target.value)}>
            <option value="">Select Folder</option>
            {folders.map((folder, index) => (
              <option key={index} value={folder}>
                {folder}
              </option>
            ))}
          </select>
        </div>

        {error && <p className="error-message">{error}</p>}

        <div className="new-deck-content">
          <div className="deck-name">
            <input
              className="name-input"
              id="name-input"
              type="text"
              placeholder="Enter deck name"
              value={deck.name}
              maxLength={120}
              onChange={(e) => setDeck({ ...deck, name: e.target.value })}
              onKeyDown={(e) => handleKeyDown(e, null)}
            />
          </div>

          <div className="card-container">
            {deck.cards.map((card, index) => (
              <div className="question-answer" key={index}>
                <div className="question-answer-group">
                  <textarea
                    id={`front-${index}`}
                    className="question-answer-input"
                    rows={3}
                    placeholder="Front of the card"
                    value={card.front}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onChange={(e) => setDeck({
                      ...deck,
                      cards: [
                        ...deck.cards.slice(0, index),
                        { ...card, front: e.target.value },
                        ...deck.cards.slice(index + 1),
                      ],
                    })}
                  />
                </div>

                <div className="question-answer-group">
                  <textarea
                    id={`back-${index}`}
                    className="question-answer-input"
                    rows={3}
                    placeholder="Back of the card"
                    value={card.back}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onChange={(e) => setDeck({
                      ...deck,
                      cards: [
                        ...deck.cards.slice(0, index),
                        { ...card, back: e.target.value },
                        ...deck.cards.slice(index + 1),
                      ],
                    })}
                  />
                </div>

                <div className="delete-card-button">
                  <button className="delete-card" onClick={() => {
                    const updatedCards = [...deck.cards];
                    updatedCards.splice(index, 1);
                    setDeck({ ...deck, cards: updatedCards });
                  }}>
                    Delete Card
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="add-card-container">
            <button className="add-card" onClick={handleAddCard}>Add New Card</button>
          </div>

          <div className="save-button-container">
            <button className="save-deck" onClick={handleSaveDeck}>Save Deck</button>
            <br />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditDeck;