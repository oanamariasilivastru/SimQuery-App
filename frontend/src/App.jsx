import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FormContainer from "./components/FormContainer";
import MainPage from "./components/MainPage";
import SignUpContainer from "./components/SignupContainer";
import AddDocumentPage from "./components/AddDocumentPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FormContainer />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/signup" element={<SignUpContainer />} />
        <Route path="/add-document" element={<AddDocumentPage />} />
      </Routes>
    </Router>
  );
};

export default App;
