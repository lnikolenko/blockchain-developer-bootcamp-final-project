import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { ProvideWeb3 } from "./hooks/web3";
import Admin from "./screens/Admin";
import Home from "./screens/Home";
import "./App.css";
import "antd/dist/antd.css";

function App() {
  return (
    <ProvideWeb3>
      <Router>
        <div>
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/admin">
              <Admin />
            </Route>
            <Route path="/*">
              <Redirect to="/" />
            </Route>
          </Switch>
        </div>
      </Router>
    </ProvideWeb3>
  );
}

export default App;
