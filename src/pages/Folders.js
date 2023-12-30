import React, { useEffect, useState } from "react";
import "./Folders.css";

const Folders = () => {
    const [folders, setFolders] = useState(null);
    const [newFolderName, setNewFolderName] = useState("");
    const [error, setError] = useState(false); // flag for successful import or some other error

    /* Use Effect -- triggers on page load */
    useEffect(() => {
        setError("");
        /* Fetch Folders from auth.js*/
        const fetchFolders = async () => {
            try {
                const response = await fetch(`http://localhost:3001/auth/get-folders`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    credentials: "include",
                });

                if (response.ok) {
                    const data = await response.json();
                    setFolders(data);
                    console.log("Successful folder load");

                } else {
                    console.error("Error fetching folders");
                    setError("Error fetching folders");
                }
            } catch (error) {
                console.error("Error fetching folders", error);
                setError("Error fetching folders");
            }
        };

        fetchFolders();
    }, []);

    /* Event when you hit save -- PUTS a new folder in your user account where the old one used to be */
    const handleSaveFolders = async () => {
        setError("");

        try {
            const response = await fetch(`http://localhost:3001/auth/update-folders`, {
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
                setError("Successful update!"); // flag for informing user of successful import

            } else {
                console.error("Some other type of error");
                setError("Error updating user");
            }

        } catch (error) {
            console.error("Error updating deck", error);
            setError("Error updating user");
        }
    };

    /* Event when you hit the button to add a new folder */
    const handleAddFolder = () => {
        if (newFolderName.trim() === "") {
            setError("Folder name cannot be empty");
            return;
        }

        setFolders((prevFolders) => [...prevFolders, newFolderName]);
        setNewFolderName("");
        setError("");
    };

    /* Event when you hit the button to delete a folder */
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
