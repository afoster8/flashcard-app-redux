import React, { useState } from "react";
import "./CreateNewDeck.css";

/* CreateNewDeck page, for adding a new deck to the user's deck field
   We get here through the Layout */
const CreateNewDeck = () => {
    const [deckName, setDeckName] = useState("");
    const [cards, setCards] = useState([{ front: "", back: "", starred: false }]);
    const [error, setError] = useState(""); // flag for successful import or some other error

    /* Happens upon hitting the save button */
    /* POSTS your new deck to your user account deck field */
    const handleSaveDeck = async () => {
        setError("");

        if (!deckName) {
            setError("You must have a name for your deck."); 
            return;
        }

        /* Sanitize your cards -- must have a non-empty front and back */
        const nonEmptyCards = cards.filter(card => card.front.trim() !== '' || card.back.trim() !== '');

        const sanitizedCards = nonEmptyCards.map((card) => ({
            front: card.front.trim() === "" ? "..." : card.front,
            back: card.back.trim() === "" ? "..." : card.back,
            starred: card.starred,
        }));

        if (sanitizedCards.length === 0) {
            setError("You must have at least one card.");
            return;
        }

        /* POST the deck you just made to the db */
        const response = await fetch("http://localhost:3001/auth/create-deck", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },

            body: JSON.stringify({
                deckName,
                cards: sanitizedCards, // create-deck will make name + cards into a deck
            }),

            credentials: "include",
        });

        /* If everything went well, empty page out and set success flag */
        if (response.ok) {
            console.log("Deck created successfully");
            setError("Successful import!");
            setDeckName("");
            setCards([{ front: "", back: "", starred: false }]);

        } else {
            console.error("Error creating deck");
            setError("Something went wrong");
        }
    };


    /* Page event functions */

    /* Trigged when we hit add card, generates another field for user input */
    const handleAddCard = () => {
        setCards([...cards, { front: "", back: "", starred: false }]);
    };

    /* Triggered when we move from card to card -- updates the current deck state variable 
       with new input  */
    const handleCardChange = (index, field, value) => {
        const updatedCards = [...cards];
        updatedCards[index][field] = value;
        setCards(updatedCards);
    };

    /* Triggered when we delete a card, updates the current deck state variable 
       without the deleted card */
    const handleDeleteCard = (index) => {
        const updatedCards = [...cards];
        updatedCards.splice(index, 1);
        setCards(updatedCards);
    };

    /* move down the page as you hit enter 
       you do have to hit enter twice when you just added a new card */
    const handleKeyDown = (event, index) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();

            if (event.target.id === "name-input") {
                document.getElementById("front-0").focus();
            } else if (event.target.id === `back-${index}` && index === cards.length - 1) {
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
                <h1>Create a new Deck</h1>

                {error && <p className="error-message">{error}</p>}

                <div className="new-deck-content">
                    <div className="deck-name">
                        <input
                            className="name-input"
                            id="name-input"
                            type="text"
                            placeholder="Enter deck name"
                            value={deckName}
                            maxLength={120}
                            onChange={(e) => setDeckName(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, null)}
                        />
                    </div>

                    <div className="card-container">
                        {cards.map((card, index) => (
                            <div className="question-answer" key={index}>
                                <div className="question-answer-group">
                                    <textarea
                                        id={`front-${index}`}
                                        className="question-answer-input"
                                        rows={3}
                                        placeholder="Front of the card"
                                        value={card.front}
                                        onChange={(e) => handleCardChange(index, "front", e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                    />
                                </div>

                                <div className="question-answer-group">
                                    <textarea
                                        id={`back-${index}`}
                                        className="question-answer-input"
                                        rows={3}
                                        placeholder="Back of the card"
                                        value={card.back}
                                        onChange={(e) => handleCardChange(index, "back", e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                    />
                                </div>

                                <div className="delete-card-button">
                                    <button className="delete-card" onClick={() => handleDeleteCard(index)}>
                                        Delete Card
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="add-card" onClick={handleAddCard}>
                        Add New Card
                    </button>
                    <br />
                    <button className="save-deck" onClick={handleSaveDeck}>
                        Save Deck
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateNewDeck;
