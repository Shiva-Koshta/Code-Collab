import logo from "./logo.svg";
import "./App.css";
import Login from "./pages/Login1";

import Faq from "./pages/Faq";
import {
  Routes,
  Route,
  Navigate,
  Router,
  BrowserRouter,
  useNavigate,
} from "react-router-dom";

import { useEffect, useState } from "react";
import axios from "axios";

import Room_Creation from "./pages/Room_Creation";
import EditorPage from "./pages/EditorPage";
import HelpPage from "./pages/HelpPage";
import About from "./pages/About";

// import './App.css';
// import Home from './pages/Room_Join';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import EditorPage from './pages/EditorPage';
// import { Toaster } from 'react-hot-toast';
function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const url = `${process.env.REACT_APP_API_URL}/auth/login/success`;
        const { data } = await axios.get(url, { withCredentials: true });
        setUser(data.user._json);
        localStorage.setItem("userData", JSON.stringify(data.user._json));
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
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
          element={user ? <Room_Creation /> : <Login />}
        />

        <Route path="/faq" element={<Faq />} />
        <Route path="/editor/:roomId" element={<EditorPage />} />
        <Route path="/help" element={<HelpPage />} />

        <Route path="/about-us" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
