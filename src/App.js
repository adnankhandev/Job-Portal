import React, { Component } from "react";
import "./App.css";
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Services from './components/Services';
import Applicants from './components/Applicants';
import Jobs from './components/Jobs';
import GeneralQuestions from './components/GeneralQuestions';

import { ApplicantsProfile } from "./components/common/ApplicantsProfile";
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import AuthService from '../src/services/Auth';
import "rsuite/dist/styles/rsuite-default.css";
import 'rsuite/lib/styles/index.less'; 

class App extends Component {
  render() {
    return (
      <BrowserRouter basename={'/'}>
          <Switch>
            <DefaultRoute exact path={`/login`} component={Login} />
            <PrivateRoute exact path={`/`} component={Dashboard} />
            <PrivateRoute exact path={`/services`} component={Services} />
            <PrivateRoute exact path={`/applicants`} component={Applicants} />
            <PrivateRoute path="/applicants/applicant" component={ApplicantsProfile} />
            <PrivateRoute exact path={`/jobs`} component={Jobs} />
            <PrivateRoute exact path={`/general-questions`} component={GeneralQuestions} />
          </Switch>
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