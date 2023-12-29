import "./CreateNewDeck.css"

const CreateNewDeck = () => {

    return (
        <div className="page">
            <div className="create-new-deck">
                <h1>Create a new Deck</h1>

                <div className="new-deck-content">

                    <div className="deck-name">
                        <input className="name-input" type="text" placeholder="Enter deck name" />
                    </div>

                    <div className="card-container">
                        <div className="question-answer">

                            <div className="question-answer-group">
                                <textarea className="question-answer-input" rows={3} placeholder="Front of the card" />
                            </div>

                            <div className="question-answer-group">
                                <textarea className="question-answer-input" rows={3} placeholder="Back of the card" />
                            </div>

                            <div className="delete-card-button">
                                <button className="delete-card">Delete Card</button>
                            </div>
                        </div>
                    </div>

                    <button className="add-card">Add New Card</button>
                    <br></br>
                    <button className="save-deck">Save Deck</button>

                </div>
            </div>
        </div>
    )
};

export default CreateNewDeck;