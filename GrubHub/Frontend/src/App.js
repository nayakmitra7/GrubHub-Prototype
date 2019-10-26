import React, { Component } from 'react';
import './App.css';
import Main from './components/Main';
import { Router } from 'react-router-dom';
import { history } from './redux/helper/history';
import { connect } from 'react-redux';
import { alertActions } from './redux/actions/alert.actions';
import Navabar from './components/LandingPage/Navbar';
//App Component
class App extends Component {
  constructor(props) {
    super(props);
    history.listen((location, action) => {
      // clear alert on location change
      this.props.clearAlerts();
    });

  }
  render() {
    return (
      //Use Browser Router to route to different pages
      <Router history={history}>
        <div>
          <Navabar></Navabar>
          {/* App Component Has a Child Component called Main*/}
          <Main />
        </div>
      </Router>
    );
  }
}
const actionCreators = {
  clearAlerts: alertActions.clear
};
//Export the App component so that it can be used in index.js
const connectedApp = connect(null, actionCreators)(App);
export { connectedApp as App };