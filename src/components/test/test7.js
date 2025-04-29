import React, { Component } from 'react';

class Test7 extends Component {
  render() {
    return <div>
      <h4 className='test-7-h4'>Test 7</h4>
      <p>Class component</p>
      <p>Exports Default</p>
      <p>A prop 'name' was added in a Class Component: {this.props.name}</p>
    </div>;
  }
}

export default Test7;