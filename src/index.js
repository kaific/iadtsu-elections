import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import App from "./App";
import Register from "./Screens/Register";
import Login from "./Screens/Login";
import Forgot from "./Screens/Forgot";
import Activate from "./Screens/Activate";
import Reset from "./Screens/Reset";
import Dashboard from "./Screens/Dashboard";
import Admin from "./Screens/Admin";
import Nominations from "./Screens/Nominations";
import Nominate from "./Screens/Nominate";
import EnterNomination from "./Screens/EnterNomination";

import PrivateRoute from "./Routes/PrivateRoute";
import AdminRoute from "./Routes/AdminRoute";

import "react-toastify/dist/ReactToastify.css";

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route path="/" exact render={(props) => <App {...props} />} />
      <Route
        path="/register"
        exact
        render={(props) => <Register {...props} />}
      />
      <Route path="/login" exact render={(props) => <Login {...props} />} />
      <Route
        path="/users/password/forgot"
        exact
        render={(props) => <Forgot {...props} />}
      />
      <Route
        path="/users/activate/:token"
        exact
        render={(props) => <Activate {...props} />}
      />
      <Route
        path="/users/password/reset/:token"
        exact
        render={(props) => <Reset {...props} />}
      />
      <PrivateRoute path="/dashboard" exact component={Dashboard} />
      <AdminRoute path="/admin" exact component={Admin} />
      <PrivateRoute path="/nominations" exact component={Nominations} />
      <PrivateRoute
        path="/nominations/nominate/:id"
        exact
        component={Nominate}
      />
      <PrivateRoute
        path="/nominations/enter"
        exact
        component={EnterNomination}
      />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);
