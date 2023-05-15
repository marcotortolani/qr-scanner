import { useState } from "preact/hooks";
import { HashRouter, Routes, Route } from "react-router-dom";

import "./app.css";

import Header from "./components/Header";
import Home from "./pages/Home";
import EnterData from "./pages/EnterData";

export function App() {
  return (
    <HashRouter>
      <div className="flex flex-col items-center">
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/enter-data" element={<EnterData />} />
        </Routes>
      </div>
    </HashRouter>
  );
}
