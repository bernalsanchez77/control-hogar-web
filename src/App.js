import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Test1 from './components/test/test1';
import { Test2 } from './components/test/test2';
import Test3 from './components/test/test3';
import Test4 from './components/test/test4';
import { Test5 } from './components/test/test5';
import { Test6 } from './components/test/test6';
import Test7 from './components/test/test7';
import Test8 from './components/test/test8';


// function App() {
//   return (
//     <div className="App">
//     </div>
//   );
// }

class App extends Component {
  render() {
    return (
    <div className="App">
      <img src={logo} className="App-logo" alt="logo" />
      <Test1></Test1>
      <Test2></Test2>
      <Test3></Test3>
      <Test4></Test4>
      <Test5 name="Bernal"></Test5>
      <Test6>
        <span>children in span</span>
      </Test6>
      <Test7 name="Bernal"></Test7>
      <Test8></Test8>
    </div>
    );
  }
}

export default App;
