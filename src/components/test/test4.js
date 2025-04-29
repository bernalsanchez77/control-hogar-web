import React, { Component } from 'react';


  const Test4 = () => {
        return React.createElement(
          'div',
          {className: 'test-4-div'},
          React.createElement(
            'h4',
            {className: 'test-4-h4'},
            'test 4'
          ),
          React.createElement(
            'p',
            {className: 'test-4-p'},
            'Made with Create Element and not JSX'
          )
        );
    }

export default Test4;