import React from 'react';
import logo from './logo.svg';
import './App.css';

import TrelloNav from './components/TrelloNav';
import Board from './components/Board';

function App() {
  return (
    <div className="App">
      <TrelloNav />
      <Board />
    </div>
  );
}

export default App;
