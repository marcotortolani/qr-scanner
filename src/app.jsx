
import { HashRouter, Routes, Route } from "react-router-dom";

import "./app.css";

import Header from "./components/Header";
import Home from "./pages/Home";
import Picking from "./pages/Picking";

export function App() {
  return (
    <HashRouter>
      <div className="w-full h-[85vh] flex flex-col items-center">
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/picking" element={<Picking />} />
        </Routes>
      </div>
    </HashRouter>
  );
}
