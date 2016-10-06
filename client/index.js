import React, { Component } from 'react';
import { render } from 'react-dom';
import request from 'superagent';

class App extends Component {

  componentDidMount() {
    console.log("mount");
  }

  render() {
    return (
      <div>
        Hoge
      </div>
    );
  }
}

render(<App />, document.getElementById('app'));
