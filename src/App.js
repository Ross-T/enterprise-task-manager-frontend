import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Enterprise Task Manager</h1>
          <p>Welcome to the Enterprise Task Manager application</p>
        </header>
      </div>
    </Router>
  );
}

export default App;
