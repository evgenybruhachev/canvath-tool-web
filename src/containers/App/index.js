import React, { Component } from 'react';
import { connect } from 'react-redux';

import Header from '../Header';

import style from './style.scss';

class App extends Component {

  render() {
    return (
      <div className={style.app}>
        <Header/>
      </div>
    );
  };

};

export default connect()(App);

