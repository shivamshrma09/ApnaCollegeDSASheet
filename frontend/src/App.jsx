import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import Login from "./components/Login";
import Signup from "./components/Signup";
import DSASheet from "./components/DSASheet";
import "./App.css";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DSASheet />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dsa-sheet" element={<DSASheet />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
