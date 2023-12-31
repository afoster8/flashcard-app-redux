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
  const [currentDeck, setCurrentDeck] = useState(null);
  const [error, setError] = useState(""); // flag to tell user about errors
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [finishCardsScreen, setFinishCardsScreen] = useState(false);
  const [starredMode, setStarredMode] = useState(false);
  const [showBack, setShowBack] = useState(false);

  /* Use Effect -- triggers on page load & id update
    Fetch associated deck to iterate through flashcards. */
  useEffect(() => {
    setError("");
    fetchDeck({ id, setDeck, setError });
  }, [id]);

  /* Use Effect -- triggers on page load and deck, starredMode update
    If we're not in starred mode, we're looking at the full deck */
  useEffect(() => {
    if (!starredMode) {
      setCurrentDeck(deck);
    }
  }, [deck, starredMode]);

  /* Triggered when we hit the star on the flashcard 
    Updates the card to be starred if it is not yet starred, and vice versa */
  const handleToggleStarred = async (e) => {
    setError(""); // reset error
    e.stopPropagation(); // so we don't flip the card

    try {
      /* save the current card information */
      const cardId = currentDeck.cards[currentCardIndex]._id;
      const deckId = deck.id;
      const starred = currentDeck.cards[currentCardIndex].starred;

      toggleStarred({
        deck, currentDeck, deckId, cardId,
        starred, setDeck, setCurrentDeck, setError
      });

    } catch (error) {
      console.log(error);
      setError("Something went wrong");
    }
  };

  /* Triggers when we hit the next card button 
    Move to next card -- update the current card index so we're working with the right one */
  const handleNextCard = () => {
    if (currentCardIndex < (currentDeck?.cards.length || 0) - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setShowBack(false);
    } else if (currentCardIndex === (currentDeck?.cards.length || 0) - 1) {
      handleFinishCards();
    }
  };

  /* Triggered when we hit the previous card button 
    Move to prev card -- update the current card index so we're working with the right one */
  const handlePrevCard = () => {
    if (finishCardsScreen) {
      setFinishCardsScreen(false);
      setShowBack(false);
    } else if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setShowBack(false);
    }
  };

  /* Triggered when we click inside the card. 
    We see the back side if we can currently see the front, and vice versa */
  const handleClick = () => {
    setShowBack(!showBack);
  };

  /* Triggers when we hit Review Starred Items Button
    Filters the deck by starring status and shows only those cards
    Only updates the current deck */
  const handleStarredMode = () => {
    setStarredMode(true);
    setFinishCardsScreen(false);
    setCurrentCardIndex(0);

    var starredDeck = {
      name: "starred_deck",
      cards: deck.cards.filter(card => card.starred)
    }

    if (starredDeck.cards) {
      setCurrentDeck(starredDeck);
    }
  }

  /* Triggered when we hit the Finish Cards button 
    Sets the flag for finished cards screen, which gives us access to
    starred mode and restarting */
  const handleFinishCards = () => {
    setFinishCardsScreen(true);
  }

  /* Triggered when we hit the restart cards button 
    Resets us back to the state when we opened the page (minus starring updates) */
  const handleRestartCards = () => {
    setFinishCardsScreen(false);
    setCurrentDeck(deck);
    setCurrentCardIndex(0);
  }

  /* Triggered when we hit the shuffle deck button 
    Shuffles the deck. */
  const handleShuffleDeck = () => {
    if (currentDeck && currentDeck.cards) {
      const shuffledDeck = [...currentDeck.cards];

      for (let i = shuffledDeck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledDeck[i], shuffledDeck[j]] = [shuffledDeck[j], shuffledDeck[i]];
      }

      setCurrentDeck({...currentDeck, cards: shuffledDeck });
      setFinishCardsScreen(false);
      setCurrentCardIndex(0);
    }
  }

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

  /* Populate the page */
  return (
    <div className="page" onKeyDown={handleKeyDown} tabIndex="0" role="button" style={{ outline: 'none' }}>
      {error && <p className="error-message">{error}</p>}

      {/* when we're not finished and when there are cards in the deck and current deck */}
      {!finishCardsScreen && deck && currentDeck && currentDeck.cards[currentCardIndex] && (
        <div className="flashcard-game">
          <div className="flashcard-container">
            <div className='counter'>
              {currentCardIndex + 1} / {currentDeck.cards.length}
            </div>

            <div className={`flashcard-content ${showBack ? 'show-back' : ''}`}
              onClick={handleClick}>

              <button className="star-toggle" onClick={(e) => handleToggleStarred(e)}>
                {currentDeck.cards[currentCardIndex].starred ? "★" : "☆"}
              </button>

              <div className="flashcard-front" style={{ whiteSpace: 'pre-line' }}>
                {currentDeck.cards[currentCardIndex].front}
              </div>

              <div className="flashcard-back" style={{ whiteSpace: 'pre-line' }}>
                {currentDeck.cards[currentCardIndex].back}
              </div>

            </div>

            <div className="flashcard-navigation">

              <button className="navigation-buttons"
                onClick={handlePrevCard}
                disabled={currentCardIndex === 0}>
                Previous Card
              </button>

              {currentCardIndex === (currentDeck.cards.length || 0) - 1 ? (
                <button className="navigation-buttons"
                  onClick={handleFinishCards}> Finish Cards </button>
              ) : (
                <button className="navigation-buttons"
                  onClick={handleNextCard}> Next Card </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* when the current deck is empty or there's some other error */}
      {(!deck || !currentDeck || (currentDeck && !(currentDeck.cards[currentCardIndex]))) && (
        <div className="page">
          <div className="flashcard-game">
            <div className="flashcard-container">
              <div className="flashcard-content">
                <p> Finished! </p>
                <button onClick={handleRestartCards}>Restart Cards</button>
              </div>
            </div>
          </div>
        </div>
      )
      }

      {/* when the finish cards screen is active */}
      {finishCardsScreen && deck && (
        <div className="page">
          <div className="flashcard-game">
            <div className="flashcard-container">
              <div className="flashcard-content">
                <p> Finished! </p>
                <button onClick={handleRestartCards}>Restart Cards</button>
                {currentDeck && (<button onClick={handleStarredMode}>Review Starred Items</button>)}
                {currentDeck && (<button onClick={handleShuffleDeck}>Shuffle Deck</button>)}
              </div>

              <div className="flashcard-navigation">
                <button className="navigation-buttons"
                  onClick={handlePrevCard}>
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      )
      }

      {!deck && <div className="page">no deck found</div>}
    </div >
  );
};

export default Flashcards;