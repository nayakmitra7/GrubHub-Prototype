import React, { Component } from 'react';
import './App.css';
import Main from './components/Main';
import { Router } from 'react-router-dom';
import { history } from './redux/helper/history';
import { connect } from 'react-redux';
import { alertActions } from './redux/actions/alert.actions';
import Navabar from './components/LandingPage/Navbar';
class App extends Component {
  constructor(props) {
    super(props);
    history.listen((location, action) => {
      this.props.clearAlerts();
    });

  }
  render() {
    return (
      <Router history={history}>
        <div>
          <Navabar></Navabar>
          <Main />
        </div>
      </Router>
    );
  }
}
const actionCreators = {
  clearAlerts: alertActions.clear
};
const connectedApp = connect(null, actionCreators)(App);
export { connectedApp as App };