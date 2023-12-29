import React from "react";

const Home = ({ loggedIn }) => {

    return (
        <div className="page">
            <div className="home">

                {loggedIn ? (
                    <>
                        <h1>Welcome!</h1>
                        <p> You are already logged in. 
                            <br></br><br></br>
                            Use the sidebar to view your current decks, or create a new one! 
                        </p>
                    </>
                ) : (
                    <>
                        <h1>Home</h1>
                        <p>You are not logged in. 
                            <br></br><br></br>
                            Use the sidebar to login if you have an account already, or register if you do not.
                        </p>
                    </>
                )}

            </div>
        </div>
    );
};

export default Home;
