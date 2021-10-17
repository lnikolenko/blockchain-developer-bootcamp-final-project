import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ProvideAuth, PrivateRoute } from "./providers/auth";
import { ProvideWeb3 } from "./providers/web3";
import SimpleStorage from "./screens/SimpleStorage";
import Home from "./screens/Home";
import Login from "./screens/Login";
import Admin from "./screens/Admin";
import "./App.css";
import "antd/dist/antd.css";

function App() {
  return (
    <ProvideWeb3>
      <ProvideAuth>
        <Router>
          <div>
            <Switch>
              <Route exact path="/">
                <Home />
              </Route>
              <Route path="/SimpleStorage">
                <SimpleStorage />
              </Route>
              <Route path="/login">
                <Login />
              </Route>
              <PrivateRoute path="/admin">
                <Admin />
              </PrivateRoute>
              <Route path="/*">
                <Home />
              </Route>
            </Switch>
          </div>
        </Router>
      </ProvideAuth>
    </ProvideWeb3>
  );
}

export default App;
