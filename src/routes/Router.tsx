import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Coins from "./Coins";
import Coin from "./Coin";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={"/:coinId/*"} element={<Coin />} />
        <Route path={`${process.env.PUBLIC_URL}/`} element={<Coins />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
