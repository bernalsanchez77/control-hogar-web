import React, { Component } from 'react';

class Test8 extends Component {
  constructor() {
    super();
    this.state = {
      name: 'Bernal'
    };
  }
  render() {
    return (
      <div>
        <h4>Test 8 mobile gg</h4>
        <p>Class component</p>
        <p>Exports Default</p>
        <p>A state 'name' was added in a Class Component and changes with the button: {this.state.name}</p>
      </div>
    );
  }
}

export default Test8;