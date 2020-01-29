import React, { Component } from "react";
import "./App.css";
import Container from "reactstrap/lib/Container";
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Services from './components/Services';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
// import UserProfile from "./components/UserProfile/UserProfile";
import 'react-toastify/dist/ReactToastify.css';
import AuthService from '../src/services/Auth';
import "rsuite/dist/styles/rsuite-default.css";
import 'rsuite/lib/styles/index.less'; 

class App extends Component {
  render() {
    return (
      <BrowserRouter basename={'/'}>
        <Container>
          <Switch>
            <DefaultRoute exact path={`/login`} component={Login} />
            <PrivateRoute exact path={`/`} component={Dashboard} />
            <PrivateRoute exact path={`/Services`} component={Services} />
          </Switch>
        </Container>
      </BrowserRouter>
    );
  }
}

export default App;



const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      !AuthService.isSignedIn() ? (
          <Redirect
            to={{
              pathname: "/login"
            }}
          />
      ) : 
      (
        <Component {...props} />
      )
    }
  />
);


const DefaultRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      AuthService.isSignedIn() ? (
          <Redirect
            to={{
              pathname: "/"
            }}
          />
      ) : 
      (
        <Component {...props} />
      )
    }
  />
);