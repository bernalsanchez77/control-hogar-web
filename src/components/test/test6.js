import React from 'react';

export const Test6 = props => {
  return <div>
    <h4>Test 6</h4>
    <p>Functional Component</p>
    <p>Exports const that is a function</p>
    <p>A children prop was added: {props.children}</p>
  </div>;
}