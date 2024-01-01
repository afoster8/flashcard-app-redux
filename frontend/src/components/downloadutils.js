/* download in JSON form */
/* star and ID are removed. */
export const downloadJson = (deck) => {

  if (!deck) {
    console.error("Deck is not downloadable");
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
/* Note that cards are separated by \n\n\n\n\n and front/back is separated by \t. */
export const downloadTxt = (deck) => {
  if (!deck) {
    console.error("Deck is not downloadable");
    return;
  }

  /* boilerplate */
  const txtContent = deck.cards.map(card => `${card.front}\t${card.back}`).join("\n\n\n\n\n");
  const blob = new Blob([txtContent], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `download.txt`;
  link.click();
}

const downloadUtils = { downloadJson, downloadTxt };
export default downloadUtils;