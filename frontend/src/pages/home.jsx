import React, { useEffect, useState } from "react";

const HomePage = () => {
  const [userName, setUserName] = useState("");
  const [userimage, setUserimage] = useState("");
  const logout = () => {
    window.open(`${process.env.REACT_APP_API_URL}/auth/logout`, "_self");
  };

  useEffect(() => {
    // Retrieve user data from local storage
    const storedUserData = localStorage.getItem("userData");

    if (storedUserData) {
      const userData = JSON.parse(storedUserData);
      // Assuming the user's name is stored in the 'name' property
      setUserName(userData.name);
      setUserimage(userData.picture);
    }
  }, []);

  return (
    <div>
      <h1>Welcome to the Homepage(just a example homepage)</h1>
      {userName && <p>Hello, {userName}!</p>}
      <img src={userimage} alt="profile" />
      <button onClick={logout}>Log Out</button>
    </div>
  );
};

export default HomePage;
