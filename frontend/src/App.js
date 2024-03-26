import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Faq from "./pages/Faq";
import Room_Creation from "./pages/Room_Creation";
import EditorPage from "./pages/EditorPage";
import About from './pages/About';
import axios from "axios";
import setAuthToken from "./utils/setAuthToken";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const url = `${process.env.REACT_APP_API_URL}/auth/login/success`;
        const { data } = await axios.get(url, { withCredentials: true });
        setUser(data.user._json);
        localStorage.setItem("userData", JSON.stringify(data.user._json));
      } catch (err) {
        console.log(err);
      }
    };

    if (localStorage.getItem("userData")) {
      const userData = JSON.parse(localStorage.getItem("userData"));
      setUser(userData);
      setAuthToken(userData.token);
    }

    checkUser();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          exact
          path="/"
          element={user ? <Room_Creation /> : <Navigate to="/login" />}
        />
        <Route
          exact
          path="/login"
          element={user ? <Navigate to="/" /> : <Login />}
        />

        <Route path="/faq" element={<Faq />} />
        <Route
          path="/editor/:roomId"
          element={user ? <EditorPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/about-us"
          element={<About/>}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
