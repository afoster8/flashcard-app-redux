import React from "react";

const UserData = () => {  
    return (
      <div className="page">
        <div className="user-data">
          <h1> Account Details </h1>
          <p> Username: {localStorage.getItem("username")} </p>
          <p> Token: {localStorage.getItem("token")} </p>
        </div>
      </div>
    );
  };
  
  export default UserData;
  