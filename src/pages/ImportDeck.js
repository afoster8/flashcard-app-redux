import "./ImportDeck.css"

const ImportDeck = () => {
    return (
        <div className="page">
            <div className="import-deck">

                <h1> Import Deck </h1>
                <p> Import a tab-separated deck by pasting it into this field. </p>

                <div className="deck-name">
                    <input className="name-input" type="text" placeholder="Enter deck name" />
                </div>

                <div className="import-container">
                    <textarea className="tsv-area" placeholder="Paste tab-separated list here..." />
                </div>

                <div className="button-container">
                    <button className="import-button">Import</button>
                </div>

            </div>
        </div>
    )
};

export default ImportDeck;