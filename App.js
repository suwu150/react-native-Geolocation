import React, { Component } from 'react';
import Router from './src/routerManager';

export default class App extends Component {
  render() {
    return (
      <Router {...this.props} />
    );
  }
}