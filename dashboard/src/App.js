import React, { Component } from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom'

import Scans from './components/Scans';
import ScanDetail from './components/ScanDetail';
import AddScan from './components/AddScan';
import NotFound from './components/NotFound';

import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Switch>
            <Route exact path='/' component={Scans} />
            <Route path='/_add' component={AddScan} />
            <Route path='/:id/finish' component={AddScan} />
            <Route path='/:id' component={ScanDetail} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
