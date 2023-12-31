import React, { useEffect, useState } from "react";
import { fetchFolders, saveFolders } from "../components/requestutils";
import "./Folders.css";

/* Manage folders page 
  Add and delete folders 
  You cannot add items to folders here. */

const Folders = () => {
  const [folders, setFolders] = useState(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [error, setError] = useState(false); // flag for successful import or some other error

  /* Use Effect -- triggers on page load and state update */
  useEffect(() => {
    setError("");
    fetchFolders({ setFolders, setError });
  }, []);

  /* Triggered when we hit the save button 
    PUTS an updated folders field into the user account folders page */
  const handleSaveFolders = async () => {
    setError("");
    saveFolders({ folders, setError });
  };

  /* Triggered when we hit the add folder button 
    Adds a new folder to the folders state variable */
  const handleAddFolder = () => {
    if (newFolderName.trim() === "") {
      setError("Folder name cannot be empty");
      return;
    }

    setFolders((prevFolders) => [...prevFolders, newFolderName]);
    setNewFolderName("");
    setError("");
  };

  /* Triggered when we hit the delete folder button 
    Updates the folder state variable to disclude the deleted folder */
  const handleDeleteFolder = (folderToDelete) => {
    setFolders((prevFolders) => prevFolders.filter((folder) => folder !== folderToDelete));
    setError("");
  };

  /* Populate the page */
  return (
    <div className="page">
      <div className="folders">
        <h1>Folders</h1>
        <p>Add or delete folders. Please note that deleting a folder will NOT delete the decks it contains.</p>
        <p>Decks must be added to folders on their respective edit deck pages.</p>
        <p>Your changes are not saved until you hit the save changes button!</p>
        {error && <p className="error-message">{error}</p>}

        <div className="add-folder-container">
          <input
            type="text"
            placeholder="New Folder Name"
            value={newFolderName}
            maxLength={30}
            onChange={(e) => setNewFolderName(e.target.value)}
          />
          <button className="add-button" onClick={handleAddFolder}>
            Add Folder
          </button>
        </div>

        <div className="folder-container">
          {folders && (
            <dl>
              {folders.map((folder, index) => (
                <div key={index} className="folder-row">
                  <dt>{folder}</dt>
                  <button className="delete-button" onClick={() => handleDeleteFolder(folder)}>
                    Delete
                  </button>
                </div>
              ))}
            </dl>
          )}
        </div>

        <button onClick={handleSaveFolders}>Save Changes</button>
      </div>
    </div>
  );
};

export default Folders;
