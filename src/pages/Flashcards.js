import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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

        /* GET the deck from auth.js */
        const fetchDeck = async () => {
            try {
                const response = await fetch(`http://localhost:3001/auth/get-deck/${id}`, {
                    method: "GET",
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                    credentials: "include",
                    });

                if (response.ok) {
                    const data = await response.json();
                    setDeck(data);
                    console.log("Successful deck load");
                    setError("")

                } else {
                    console.error("Error fetching deck");
                    setError("Error fetching deck");
                }

            } catch (error) {
                console.error("Error fetching deck", error);
                setError("Error fetching deck");
            }
        };

        fetchDeck();
    }, [id]);





    /* Page event functions  */

    /* Mark a card as unknown (starred), kind of like Quizlet */
    /* Good for focusing on what you don't know */
    /* PATCHes the card we're working on to negate the starred field */
    const handleToggleStarred = async (e) => {
        setError(""); // reset error
        e.stopPropagation(); // so we don't flip the card

        try {
            /* save the current card information and feed */
            const cardId = deck.cards[currentCardIndex]._id;
            const deckId = deck.id; 
            const starred = deck.cards[currentCardIndex].starred;

            const response = await fetch(`http://localhost:3001/auth/update-card/${deckId}/${cardId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                credentials: "include",
                body: JSON.stringify({ starred: !starred }),
                });

            /* update our local state variable with the new deck */
            if (response.ok) {
                const updatedDeck = {
                    ...deck,
                    cards: deck.cards.map((card) => {
                        if (card._id === cardId) {
                            return { ...card, starred: !card.starred };
                        }
                        return card;
                    }),
                };

                setDeck(updatedDeck);
                setError("");

            } else {
                console.error("Error updating card");
                setError("Something went wrong.");
            }

        } catch (error) {
            console.error("Error updating card", error);
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

    /* Triggers when we hit the previous card button 
        Move to prev card -- update the current card index so we're working with the right one */
    const handlePrevCard = () => {
        if (currentCardIndex > 0) {
            setCurrentCardIndex(currentCardIndex - 1);
            setShowBack(false);
        }
    };

    /* Triggers when we click inside the card. We want to see the back side (or front side if 
        we're looking at the back side) */
    const handleClick = () => {
        setShowBack(!showBack);
    };

    /* use > and < to move between cards, and space ^ and V to flip the card  */
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

                            <button className="star-toggle"onClick={(e) => handleToggleStarred(e)}>
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