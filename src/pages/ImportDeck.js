import React, { useState } from "react";
import "./ImportDeck.css";

/* ImportDeck page 
   POST a new deck in TSV format to the user's deck list */
const ImportDeck = () => {
    const [deckName, setDeckName] = useState("");
    const [tsvContent, setTsvContent] = useState("");
    const [error, setError] = useState(""); // flag for showing errors

    /* Page event functions */

    /* Keep track of deck name changes and update state variable appropriately */
    const handleDeckNameChange = (e) => {
        setDeckName(e.target.value);
    };

    /* Keep track of TSV changes and update state variable appropriately */
    const handleTsvContentChange = (e) => {
        setTsvContent(e.target.value);
    };

    /* Enter to go down to next field */
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();

            if (e.target.name === "deck-name") {
                document.getElementById("tsv-area").focus();

            } else if (e.target.name === "tsv-area") {
                handleImport();
            }
        }
    };

    /* Parse the input and POST deck to user account deck list */
    const handleImport = async () => {
        setError(""); // set error to empty

        if (deckName.trim() === "" || tsvContent.trim() === "") {
            setError("You must have both a deck name and a tab-separated list.");
            return;
        }

        /* First try to parse the input */
        try {
            /* split cards by \n and front/back by \t */
            const cards = tsvContent.split("\n").map((line) => {
                const [front, back] = line.split("\t");

                /* if there's some parsing error, let them know */
                if (!front || !back) {
                    setError("Parsing error in tab-separated list. Please check your input for extra new lines or other mistakes.");
                }

                return { front, back, starred: false };
            });

            /* workaround catch for a parse error because no return in a map */
            if (!error) {

                /* POST cards to user account deck list */
                const response = await fetch("http://localhost:3001/auth/create-deck", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({
                        deckName,
                        cards, // together create-deck will make a deck
                    }),
                    credentials: "include",
                });

                /* If everything went well, reset all fields and populate success flag */
                if (response.ok) {
                    console.log("Deck imported successfully");
                    setError("Successful import!");
                    setDeckName("");
                    setTsvContent("");

                } else {
                    console.error("Error importing deck");
                    setError("Something went wrong");
                }
            }

        } catch (error) {
            console.error("Error parsing or importing deck", error);
            setError("Something went wrong");
        }
    };

    /* Populate the page */
    return (
        <div className="page">
            <div className="import-deck">
                <h1>Import Deck</h1>
                <p>Import a tab-separated deck by pasting it into this field.</p>

                {error && <p className="error-message">{error}</p>}

                <div className="deck-name">
                    <input
                        className="name-input"
                        type="text"
                        placeholder="Enter deck name"
                        value={deckName}
                        onChange={handleDeckNameChange}
                        onKeyDown={handleKeyDown}
                        name="deck-name"
                        maxLength={120}
                    />
                </div>

                <div className="import-container">
                    <textarea
                        id="tsv-area"
                        className="tsv-area"
                        placeholder="Paste tab-separated list here..."
                        value={tsvContent}
                        onChange={handleTsvContentChange}
                        onKeyDown={handleKeyDown}
                        name="tsv-area"
                    />
                </div>

                <div className="button-container">
                    <button className="import-button" onClick={handleImport}>
                        Import
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImportDeck;
