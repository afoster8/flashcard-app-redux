import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchDeck, toggleStarred } from "../components/requestutils";
import "./Flashcards.css";

/* Flashcards page
  This is where the magic happens. 
  Accessed through the View All Decks page, associated with one deck in particular. */

const Flashcards = () => {
  const { id } = useParams();
  const [deck, setDeck] = useState(null);
  const [error, setError] = useState(""); // flag to tell user about errors
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);

  /* Use Effect -- triggers on page load & state update
    Fetch associated deck to iterate through flashcards. */
  useEffect(() => {
    setError("");
    fetchDeck({ id, setDeck, setError });
  }, [id]);

  /* Triggered when we hit the star on the flashcard 
    Updates the card to be starred if it is not yet starred, and vice versa */
  const handleToggleStarred = async (e) => {
    setError(""); // reset error
    e.stopPropagation(); // so we don't flip the card

    try {
      /* save the current card information */
      const cardId = deck.cards[currentCardIndex]._id;
      const deckId = deck.id;
      const starred = deck.cards[currentCardIndex].starred;

      toggleStarred({ deck, deckId, cardId, starred, setDeck, setError });

    } catch (error) {
      console.log(error);
      setError("Something went wrong");
    }
  };

  /* Triggers when we hit the next card button 
    Move to next card -- update the current card index so we're working with the right one */
  const handleNextCard = () => {
    if (currentCardIndex < (deck?.cards.length || 0) - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setShowBack(false);
    }
  };

  /* Triggered when we hit the previous card button 
    Move to prev card -- update the current card index so we're working with the right one */
  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setShowBack(false);
    }
  };

  /* Triggered when we click inside the card. 
    We see the back side if we can currently see the front, and vice versa */
  const handleClick = () => {
    setShowBack(!showBack);
  };

  /* Use > and < to move between cards, and space ^ and V to flip the card  */
  const handleKeyDown = (e) => {
    if (e.key === ' ') {
      setShowBack(!showBack);
    } else if (e.key === 'ArrowUp') {
      setShowBack(true);
    } else if (e.key === 'ArrowDown') {
      setShowBack(false);
    } else if (e.key === 'ArrowLeft') {
      handlePrevCard();
    } else if (e.key === 'ArrowRight') {
      handleNextCard();
    }
  };

  /* listens for the above inputs! responsive! */
  window.addEventListener("keydown", handleKeyDown);

  /* Populate the page */
  return (
    <div className="page" onKeyDown={handleKeyDown}>
      {error && <p className="error-message">{error}</p>}

      {deck && (
        <div className="flashcard-game">
          <div className="flashcard-container">
            <div className='counter'>
              {currentCardIndex + 1} / {deck.cards.length}
            </div>

            <div className={`flashcard-content ${showBack ? 'show-back' : ''}`}
              onClick={handleClick}>

              <button className="star-toggle" onClick={(e) => handleToggleStarred(e)}>
                {deck.cards[currentCardIndex].starred ? "★" : "☆"}
              </button>

              <div className="flashcard-front">{deck.cards[currentCardIndex].front}</div>
              <div className="flashcard-back">{deck.cards[currentCardIndex].back}</div>
            </div>

            <div className="flashcard-navigation">

              <button className="navigation-buttons"
                onClick={handlePrevCard}
                disabled={currentCardIndex === 0}>
                Previous Card
              </button>

              <button className="navigation-buttons"
                onClick={handleNextCard}
                disabled={currentCardIndex === (deck.cards.length || 0) - 1}>
                Next Card
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Flashcards;