const showAllDecks = () => {
  return (<p>Look at all these decks</p>)
};

const ViewAllDecks = () => {
  return (
    <div className="page">
      <div className="view-all-decks">
        <h1>All Decks</h1>

        <div className="deck-container">{showAllDecks()}</div>
        
      </div>
    </div>
  );
};

export default ViewAllDecks;
