import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";

import Homepage from "./components/homepage";
import Play21 from "./components/play21";
import Header from "./components/header";
import Footer from "./components/footer";
import Register from "./components/Register";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/play21" element={<Play21 />} />
          <Route path="/register" element={<Register />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
