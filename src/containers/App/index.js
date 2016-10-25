import React, { Component } from 'react';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';

import Header from '../Header';
import HeaderMobile from '../HeaderMobile';
import Toolbar from '../Toolbar';

class App extends Component {

  render() {
    return (
      <div className='app'>

        <MediaQuery query='(min-width: 769px)'>
          <Header/>
        </MediaQuery>

        <MediaQuery query='(max-width: 768px)'>
          <HeaderMobile/>
        </MediaQuery>

        <div className='app-container'>
          <Toolbar/>
        </div>

      </div>
    );
  };

};

export default connect()(App);

