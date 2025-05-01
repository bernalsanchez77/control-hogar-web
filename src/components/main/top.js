import React, { Component } from 'react';

class Top extends Component {
  constructor() {
    super();
    this.state = {
      name: 'Cable'
    };
  }
  changeMessage() {
    this.setState({
      name: 'Roku'
    });
    fetch('https://ifttt.massmedia.stream/api/v1/bersanesp/data', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: 'este',
    })
      .then(response => {
        if (!response.ok) {
          alert('ok')
        }
        // return response.json();
      }).then().catch(error => console.error('Error:', error));
  }
  render() {
    return (
      <div>
        <button onClick={() => this.changeMessage()}>{this.state.name}</button>
      </div>
    );
  }
}

export default Top;
