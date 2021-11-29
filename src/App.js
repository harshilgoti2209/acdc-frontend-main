import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import "./App.css";

const Home = React.lazy(() => import("./pages/Home"));
const EditUser = React.lazy(() => import("./pages/EditUser"));

export default function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <React.Suspense
          fallback={
            <Loader
              type="Bars"
              color="#340645"
              height={30}
              width={30}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
              }}
            />
          }
        >
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>

            <Route exact path="/setting">
              <Home />
            </Route>

            <Route exact path="/admin/report">
              <Home />
            </Route>

            <Route exact path="/admin/users">
              <Home />
            </Route>

            <Route exact path="/admin/logs">
              <Home />
            </Route>

            <Route exact path="/admin/edituser/:username">
              <EditUser />
            </Route>

            <Redirect to="/" />
          </Switch>
        </React.Suspense>
      </BrowserRouter>
    </div>
  );
}
