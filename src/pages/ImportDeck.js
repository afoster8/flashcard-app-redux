import React, { useState, useEffect } from "react";
import { fetchFolders, createNewDeck } from "../components/requestutils";

/* ImportDeck page 
  POST a new deck in TSV format to the user's deck list 
  
  Note that cards must be separated by \n\n\n and front/back must be separated by \t 
  This makes it so cards can have \n in them. */

const ImportDeck = () => {
  const [deckName, setDeckName] = useState("");
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [tsvContent, setTsvContent] = useState("");
  const [error, setError] = useState(""); // flag for showing errors

  /* Use Effect -- triggers on page load & state update
    Fetch folders from user folder field. */
  useEffect(() => {
    setError("");
    fetchFolders({ setFolders, setError });
  }, []);

  /* Triggered when we change the folder assignment in the dropdown
    Keep track of folder assignment */
  const handleAssignToFolder = (e) => {
    setSelectedFolder(e);
  }

  /* Triggered when we enter input in deck name field
    Keep track of deck name changes and update state variable appropriately */
  const handleDeckNameChange = (e) => {
    setDeckName(e.target.value);
  };

  /* Triggered when we enter input in the TSV field  
    Keep track of TSV changes and update state variable appropriately */
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

  /* Triggered when we hit the import button. 
    Attempts to parse input, then fire a request to POST to the user deck field.  */
  const handleImport = async () => {
    setError(""); // set error to empty

    if (deckName.trim() === "" || tsvContent.trim() === "") {
      setError("You must have both a deck name and a tab-separated list.");
      return;
    }

    var cards = parseInput();

    if (cards) {
      var folderArray = [selectedFolder];
      createNewDeck({ deckName, cards, folderArray, setDeckName, setError });
    } else {
      setError("Error parsing deck. Try again.");
      console.log("Error with parsing before server request is sent.")
    }
  };

  /* Try to parse the input, based on the prescribed parsing method */
  const parseInput = () => {
    const parsedCards = tsvContent.split("\n\n\n\n\n").map((line) => {
      const [front, back] = line.split("\t");
      return { front, back, starred: false };
    });

    return parsedCards;
  }

  /* Populate the page */
  return (
    <div className="page">
      <div className="import-deck">
        <h1>Import a New Deck</h1>

        <p>Import a tab-separated deck by pasting it into this field.</p>
        <p>Make sure your cards are separated by five line breaks (\n\n\n\n\n) and front/back is
          separated by a tab! (\t) If you are importing from Quizlet, enter \n\n\n\n\n into the
          between rows field, and choose tab for the between term and definition field.
        </p>
        <p>If you get an import error, it's possible that you have cards with empty fronts, backs, or
          cards that are entirely empty. Fix these errors before importing. </p>
        <br />

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
