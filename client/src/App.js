import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ProvideAuth, PrivateRoute } from "./auth";
import SimpleStorage from "./screens/simple_storage";
import Home from "./screens/home";
import Login from "./screens/login";
import Admin from "./screens/admin";

import "./App.css";

class App extends Component {
  render() {
    return (
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
    );
  }
}

export default App;
