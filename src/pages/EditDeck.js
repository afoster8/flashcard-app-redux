import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./EditDeck.css";

/* Edit Deck page 
   We get here through the ViewAllCards page
   Associated with a specific user deck, noted by ID */
const EditDeck = () => {
    const { id } = useParams(); 
    const [deck, setDeck] = useState(null);
    const [userFolders, setUserFolders] = useState([]);
    const [error, setError] = useState(false); // flag for successful import or some other error

    /* Use Effect -- triggers on page load */
    useEffect(() => {
        setError("");

        /* Fetch Deck from auth.js*/
        const fetchDeck = async () => {
            try {
                const response = await fetch(`http://localhost:3001/auth/get-deck/${id}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    credentials: "include",
                });

                if (response.ok) {
                    const data = await response.json();
                    setDeck(data);
                    console.log("Successful deck load");

                } else {
                    console.error("Error fetching deck");
                    setError("Error fetching deck");
                }
            } catch (error) {
                console.error("Error fetching deck", error);
                setError("Error fetching deck");
            }
        };

        const fetchUserFolders = async () => {
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
                    setUserFolders(data);
                    console.log("Successful user folders load");
                } else {
                    console.error("Error fetching user folders");
                    setError("Error fetching user folders");
                }
            } catch (error) {
                console.error("Error fetching user folders", error);
                setError("Error fetching user folders");
            }
        };

        fetchDeck();
        fetchUserFolders();
    }, [id]);

    /* Show loading screen if we're waiting on a response above */
    if (!deck) {
        return <p>Loading...</p>;
    }




    /* Page event functions */

    /* Assigns the deck to a folder */
    const handleAssignToFolder = (folderName) => {
        setDeck({ ...deck, folder: [folderName] });
        console.log(deck);
    };

    /* Event when you hit save -- PUTS a new deck in your user account where the old one used to be */
    const handleSaveDeck = async () => {
        setError("");

        try {
            console.log(deck);
            const response = await fetch(`http://localhost:3001/auth/update-deck/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },

                body: JSON.stringify(deck), // sends the whole deck, including the ID
                credentials: "include",
            });

            if (response.ok) {
                console.log("Deck updated successfully");
                setError("Successful import!"); // flag for informing user of successful import

            } else {
                console.error("Some other type of error");
                setError("Error updating deck");
            }

        } catch (error) {
            console.error("Error updating deck", error);
            setError("Error updating deck");
        }
    };

    /* Initiates a new card for user input */
    const handleAddCard = () => {
        setDeck({
            ...deck,
            cards: [...deck.cards, { front: "", back: "", starred: false }],
        })
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
                <h1>Edit Deck</h1>

                <div className="assign-folder-container">
                    <h4>Assign to Folder: </h4>
                    <select onChange={(e) => handleAssignToFolder(e.target.value)}>
                        <option value="">Select Folder</option>
                        {userFolders.map((folder, index) => (
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

                    <button className="add-card" onClick={handleAddCard}>Add New Card</button>
                    <br />
                    <button className="save-deck" onClick={handleSaveDeck}>Save Deck</button>
                </div>
            </div>
        </div>
    );
};

export default EditDeck;