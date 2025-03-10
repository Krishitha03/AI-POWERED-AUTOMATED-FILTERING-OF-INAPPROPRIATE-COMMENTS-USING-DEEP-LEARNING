import React from 'react';
import logo from './logo.svg';
import './App.css';
import {Box} from './Box';
import People from './people';
import PeopleForm from './PeopleForm';

function App() {
  return (
    <div className="App">
      <h1>React App</h1>
      <PeopleForm/>
      <People />
      <Box name={"Electronics"} />
      <Box name={"Groceries"} />
      <Box name={"Books"} />
    </div>
  );
}

export default App;