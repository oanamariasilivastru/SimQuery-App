import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FormContainer from "./components/FormContainer";
import MainPage from "./components/MainPage";
import SignUpContainer from "./components/SignupContainer";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FormContainer />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/signup" element={<SignUpContainer />} />
      </Routes>
    </Router>
  );
};

export default App;
