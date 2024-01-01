/* 

  This is where all the requests to the server live. 

  
*/

/* GET the user's current folders and return an error/success message */
/* Used by CreateNewDeck, ImportDeck, ViewAllDecks, EditDeck, Folders */
export const fetchFolders = async ({ setFolders, setError }) => {
  try {
    const response = await fetch("https://intense-atoll-92670/auth/get-folders", {
      method: "GET",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();
      setFolders(data);
      console.log("Successful user folders load");
      setError("")

    } else {
      console.error("Bad response from server");
      setError("Error fetching user folders");
    }

  } catch (error) {
    console.error("Error fetching user folders", error);
    setError("Error fetching user folders");
  }
};

/* Update the folders field of the user account and return an error/success message */
/* Used by Folders */
export const saveFolders = async ({ folders, setError }) => {
  try {
    const response = await fetch(`https://intense-atoll-92670/auth/update-folders`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ folders }),
      credentials: "include",
    });

    if (response.ok) {
      console.log("Folders updated successfully");
      setError("Successful update!");
    } else {
      console.error("Bad response from server.");
      setError("Error updating user");
    }

  } catch (error) {
    console.error("Error updating deck", error);
    setError("Error updating user");
  }
};

/* GET the deck indicated by the ID and return an error/success message */
/* Used by ViewAllDecks, Flashcards, EditDeck */
export const fetchDeck = async ({ id, setDeck, setError }) => {
  try {
    const response = await fetch(`https://intense-atoll-92670/auth/get-deck/${id}`, {
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
      console.error("Bad response from server");
      setError("Error fetching deck");
    }

  } catch (error) {
    console.error("Error fetching deck", error);
    setError("Error fetching deck");
  }
};

/* GET the decks field from the user account from db */
export const fetchDecks = async ({ setDecks, setError }) => {
  try {
    const response = await fetch("https://intense-atoll-92670/auth/get-decks", {
      method: "GET",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();
      setDecks(data.decks);
      setError("");

    } else {
      console.error("Bad response from server.");
      setError("Something went wrong");
    }
  } catch (error) {
    console.error("Error fetching decks", error);
    setError("Something went wrong");
  }
};

/* POST a new deck to the user's deck field and return an error/success message */
/* Used by CreateNewDeck, ImportDeck */
export const createNewDeck = async ({ deckName, cards, folderArray, setDeckName, setError }) => {
  try {
    const response = await fetch("https://intense-atoll-92670/auth/create-deck", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        deckName,
        cards,
        folderArray // together create-deck will make a deck
      }),

      credentials: "include",
    });

    if (response.ok) {
      console.log("Deck imported successfully");
      setError("Successful import!");
      setDeckName("");

    } else {
      console.error("Error creating deck, possible parsing error");
      setError("Error parsing deck. Check your input.");
    }

  } catch (error) {
    console.error("Error creating deck", error);
    setError("Something went wrong");
  }
};

/* Update the deck indicated by the ID and return an error/success message */
/* Used by EditDeck */
export const saveDeck = async ({ id, deck, setError }) => {
  try {
    const response = await fetch(`https://intense-atoll-92670/auth/update-deck/${id}`, {
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
      setError("Successful edit!");
    } else {
      console.error("Bad response from server");
      setError("Error updating deck. Check if there are empty fields. ");
    }

  } catch (error) {
    console.error("Error updating deck", error);
    setError("Error updating deck.");
  }
};

/* DELETE the deck indicated by the ID and return an error/success message */
/* Used by EditDeck */
export const deleteDeck = async ({ id, setError }) => {
  try {
    const response = await fetch(`https://intense-atoll-92670/auth/delete-deck/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      credentials: "include",
    });

    if (response.ok) {
      console.log("Deck deleted successfully");
      setError("");
    } else {
      console.error("Bad response from server");
      setError("Error deleting deck");
    }

  } catch (error) {
    console.error("Error deleting deck", error);
    setError("Error deleting deck");
  }
};

/* Update a specific card (identified through deckID and card ID) to be starred 
  (i.e. marked as unknown) and return an error/success message */
/* Used by Flashcards */
export const toggleStarred = async ({ deck, currentDeck, deckId, cardId, starred, setDeck, setCurrentDeck, setError }) => {
  try {
    const response = await fetch(`https://intense-atoll-92670/auth/update-card/${deckId}/${cardId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      credentials: "include",
      body: JSON.stringify({ starred: !starred }),
    });

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

      const updatedCurrentDeck = {
        ...currentDeck,
        cards: currentDeck.cards.map((card) => {
          if (card._id === cardId) {
            return { ...card, starred: !card.starred };
          }
          return card;
        }),
      };

      setDeck(updatedDeck);
      setCurrentDeck(updatedCurrentDeck);
      setError("");

      console.log("Successfully (un)starred card");

    } else {
      console.error("Bad response from server");
      setError("Something went wrong");
    }

  } catch (error) {
    console.error("Error updating card", error);
    setError("Something went wrong");
  }
};


/* DELETE the user from the database and log the user out, navigate them to home */
/* Used by UserAccount */
export const deleteAccount = async ({ setLoggedIn, setError }) => {
  try {
    const response = await fetch("https://intense-atoll-92670/auth/delete-account", {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      credentials: "include",
    });

    if (response.ok) {
      console.log("Account deleted successfully");
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      setLoggedIn(false);
      setError("");

    } else {
      console.error("Bad request from server.");
      setError("Error deleting account");
    }

  } catch (error) {
    console.error(error);
    setError("Error deleting account");
  }
};

/* Update the user's username and return an error/success message */
/* Used by UserAccount */
export const updateUsername = async ({ newUsername, setNewUsername, setError }) => {
  try {
    const response = await fetch("https://intense-atoll-92670/auth/update-username", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ newUsername }),
      credentials: "include",
    });

    if (response.ok) {
      setError("Account updated!");
      localStorage.setItem("username", newUsername);
      setNewUsername("");
    } else {
      console.error("Bad response from server.");
      setError("Error updating username");
    }

  } catch (error) {
    console.error("Error updating username", error);
    setError("Error updating username");
  }
};

/* Update the user's PIN and return an error/success message */
/* Used by UserAccount */
export const updatePin = async ({ newPin, setNewPin, setReenteredPin, setError }) => {
  try {
    const response = await fetch("https://intense-atoll-92670/auth/update-pin", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ newPin }),
      credentials: "include",
    });

    if (response.ok) {
      console.log("PIN updated successfully");
      setError("Account updated!");
      setNewPin("");
      setReenteredPin("");

    } else {
      console.error("Bad response from server");
      setError("Error updating PIN");
    }

  } catch (error) {
    console.error("Error updating PIN", error);
    setError("Error updating PIN");
  }
};

const requestUtils = {
  fetchFolders,
  saveFolders,
  fetchDecks,
  fetchDeck,
  createNewDeck,
  saveDeck,
  deleteDeck,
  toggleStarred,
  deleteAccount,
  updateUsername,
  updatePin
};

export default requestUtils;