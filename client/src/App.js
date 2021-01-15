import React from "react";
import "./styles/app.css";
import { SettingsBar } from "./components/SettingsBar";
import { Toolbar } from "./components/Toolbar";
import { Canvas } from "./components/Canvas";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import { RuFlag } from "./icons/ru";
import { EnFlag } from "./icons/en";

function App() {
  return (
    <Router>
      <div className="app">
      <RuFlag />
      <EnFlag />

        <Switch>
          <Route path="/:id">
            <Toolbar />
            <SettingsBar />
            <Canvas />
          </Route>
          <Redirect to={`f${(Math.random()*1e18).toString(36)}`} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
