// src/App.js
import { Routes, Route } from 'react-router-dom';
import TestRedux from './components/TestRedux';

function App() {
  return (
    <div className="App">
      <h1>My Redux App</h1>
      <Routes>
        <Route path="/" element={<TestRedux />} />
      </Routes>
    </div>
  );
}

export default App;
