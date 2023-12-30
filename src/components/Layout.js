import { Outlet, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./Layout.css";

/* Sidebar -- stays on the side at all times 
  Uses props to find out whether we're logged in or not */
const Layout = ({ loggedIn, setLoggedIn }) => {
  const navigate = useNavigate();

  /* UseEffect to look for the token (and thus populate appropriate sidebar items!) */
  useEffect(() => {
    if (localStorage.getItem("token")) {
      setLoggedIn(true);
    }

  }, [setLoggedIn]);

  /* Log out, removing your info from local storage and setting appropriate flags */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setLoggedIn(false);
    navigate("/");
    console.log("Logging out...")
  };

  /* Populate sidebar 
    Remember that we only want to show ViewAllDecks, CreateNewDeck, ImportDeck, and Logout if we're logged in
    and we only want to show Login and Register if we are *not* logged in! */
  return (
    <>
      <nav>
        <div className="sidebar">

          <div className="sidebar-container-top">

            <div className="sidebar-option">
              <Link to="/">
                <button className="sidebar-option-button">Home</button>
              </Link>
            </div>

          </div>

          <div className="sidebar-container-mid">

            {loggedIn && (
              <>
                <div className="sidebar-option">
                  <Link to="/view-all-decks">
                    <button className="sidebar-option-button">View All Decks</button>
                  </Link>
                </div>

                <div className="sidebar-option">
                  <Link to="/create-new-deck">
                    <button className="sidebar-option-button">Create New Deck</button>
                  </Link>
                </div>

                <div className="sidebar-option">
                  <Link to="/import-deck">
                    <button className="sidebar-option-button">Import Deck</button>
                  </Link>
                </div>
              </>
            )}

          </div>

          <div className="sidebar-container-bottom">

            {loggedIn ? (

              <>

                <div className="sidebar-option">
                  <Link to="/user-account">
                    <button className="sidebar-option-button">User Account</button>
                  </Link>
                </div>
                
                <div className="sidebar-option">
                  <button className="sidebar-option-button" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              </>

            ) : (

              <>
                <div className="sidebar-option">
                  <Link to="/login">
                    <button className="sidebar-option-button">Login</button>
                  </Link>
                </div>

                <div className="sidebar-option">
                  <Link to="/register">
                    <button className="sidebar-option-button">Register</button>
                  </Link>
                </div>
              </>

            )}

          </div>
        </div>
      </nav>

      <Outlet />
    </>
  );
};

export default Layout;
