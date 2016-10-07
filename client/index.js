import React, { Component } from 'react';
import { render } from 'react-dom';
import request from 'superagent';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      items: [],
    };
  }

  componentDidMount() {
    request.get('/api/items').end((err, res) => {
      this.setState({
        items: res.body,
      });
    });
  }

  render() {
    return (
      <div>
        <h1>Docker Compose Test</h1>
        <ul>
          { this.state.items.map((item, index) => <li key={index}>{item}</li>)}
        </ul>
      </div>
    );
  }
}

render(<App />, document.getElementById('app'));
