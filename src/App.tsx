import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { Checkout } from "./pages/Checkout";
import Products from "./pages/Products";

import "./App.css";

const App = () => {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/checkout">
            <Checkout />
          </Route>
          <Route path="/">
            <Products />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;
