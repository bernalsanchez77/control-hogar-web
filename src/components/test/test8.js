import React, { Component } from 'react';

class Test8 extends Component {
  constructor() {
    super();
    this.state = {
      name: 'Bernal'
    };
  }
  changeMessage() {
    this.setState({
      name: 'Amanda'
    })
  }
  render() {
    return (
      <div>
        <h4>Test 8 test git</h4>
        <p>Class component</p>
        <p>Exports Default</p>
        <p>A state 'name' was added in a Class Component and changes with the button: {this.state.name}</p>
        <button onClick={() => this.changeMessage()}>Subscribe</button>
      </div>
    );
  }
}

export default Test8;
