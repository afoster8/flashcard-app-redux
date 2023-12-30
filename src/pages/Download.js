import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

/* Download page 
   We get there through the ViewAllCards page
   Associated with a specific user deck id */
const DownloadDeck = () => {
    const { id } = useParams();
    const [deck, setDeck] = useState(null);
    const [error, setError] = useState(false); // flag for successful import or some other error

    /* Use Effect -- triggers on page load */
    useEffect(() => {
        setError("");

        /* Fetch deck from auth.js */
        const fetchDeck = async () => {
            setError("");
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
                    setError("");

                } else {
                    console.error("Error fetching deck");
                    setError("Something went wrong");
                }
            } catch (error) {
                console.error("Error fetching deck", error);
                setError("Something went wrong");
            }
        };

        fetchDeck();

    }, [id]);

    /* Show loading screen if we're waiting on a response above */
    if (!deck) {
        return <p>Loading...</p>;
    }

    /* Page event functions */

    /* download in JSON form */
    const downloadJson = () => {
        setError("");

        if (!deck) {
            console.error("Deck is not downloadable");
            setError("Something went wrong.");
            return;
        }

        /* Sanitize deck to remove the ID and star -- not relevant to user */
        const sanitizedDeck = {
            name: deck.name,
            cards: deck.cards.map(card => ({ front: card.front, back: card.back }))
        };

        /* boilerplate */
        const jsonContent = JSON.stringify(sanitizedDeck, null, 2);
        const blob = new Blob([jsonContent], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "download.json";
        link.click();
    }


    /* download in TSV form -- good for quizlet */
    const downloadTxt = () => {
        if (!deck) {
            console.error("Deck is not downloadable");
            setError("Something went wrong.");
            return;
        }

        /* boilerplate */
        const txtContent = deck.cards.map(card => `${card.front}\t${card.back}`).join("\n");
        const blob = new Blob([txtContent], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `download.txt`;
        link.click();
    }

    /* Populate the page */
    return (
        <div className="page">
            <h1>Download Your "{deck.name}" Deck</h1>
            {error && <p classname="error-message">{error}</p>}
            <p>You can either download the above deck as a JSON file (with just front and back attributes), or as a tab-separated file.</p>
            <button onClick={downloadJson}>Download JSON</button>
            <button onClick={downloadTxt}>Download TSV</button>
        </div>
    );
};

export default DownloadDeck;
