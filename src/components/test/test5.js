import React from 'react';

export const Test5 = props => {
  return <div>
    <h4>Test 5</h4>
    <p>Functional Component</p>
    <p>Exports const that is a function</p>
    <p>A prop 'name' was added in a Functional Component: {props.name}</p>
  </div>;
}