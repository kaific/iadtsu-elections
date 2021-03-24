import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import App from "./App";

import Register from "./Screens/auth/Register";
import Login from "./Screens/auth/Login";
import Forgot from "./Screens/auth/Forgot";
import Activate from "./Screens/auth/Activate";
import Reset from "./Screens/auth/Reset";

import Dashboard from "./Screens/Dashboard";
import Nominations from "./Screens/nominations/Nominations";
import Nominate from "./Screens/nominations/Nominate";
import EnterNomination from "./Screens/nominations/EnterNomination";
import Elections from "./Screens/elections/Elections";

import AdminDashboard from "./Screens/admin/AdminDashboard";
import AdminNominations from "./Screens/admin/AdminNominations";
import AdminElections from "./Screens/admin/AdminElections";
import CreateElection from "./Screens/admin/elections/Create";
import AdminUsers from "./Screens/admin/AdminUsers";

import PrivateRoute from "./Routes/PrivateRoute";
import AdminRoute from "./Routes/AdminRoute";

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
      <PrivateRoute path="/elections" exact component={Elections} />

      <AdminRoute path="/admin" exact component={AdminDashboard} />
      <AdminRoute
        path="/admin/nominations"
        exact
        component={AdminNominations}
      />
      <AdminRoute path="/admin/elections" exact component={AdminElections} />
      <AdminRoute
        path="/admin/elections/new"
        exact
        component={CreateElection}
      />
      <AdminRoute path="/admin/users" exact component={AdminUsers} />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);
