import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FormContainer from "./components/FormContainer";
import MainPage from "./components/MainPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FormContainer />} />
        <Route path="/main" element={<MainPage />} />
      </Routes>
    </Router>
  );
};

export default App;
