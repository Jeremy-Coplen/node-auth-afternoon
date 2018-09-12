import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      students: []
    }
  }
  render() {
    return (
      <div className="App">
        <h1>Auth Afternoon</h1>
        <button>Login</button>
        <button>Logout</button>
        <hr/>
      </div>
    );
  }
}

export default App;
