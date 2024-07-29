import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1 className='title'>DSA Project 3</h1>
        <div className='sectionsContainer'>
          <div className='section'>
            <div className='sectionTitle'>Sort Type</div>
            <div className='sortButtonsContainer'>
              <button className='sortButton'>Merge sort</button>
              <button className='sortButton'>Quick sort</button>
              <button className='sortButton'>Shell sort</button>
            </div>
          </div>
          <div className='section'>
          <div className='sectionTitle'>Data Type</div>
            <div className='sortButtonsContainer'>
              <button className='sortButton'>Movie popularities</button>
              <button className='sortButton'>Actor Names(lexographically)</button>
              <button className='sortButton'>Cars (by price)</button>
            </div>
          </div>
          <div className='section'>
            <div className='sectionTitle'>Results</div>
            <div className='resultsContainer'>
              <div className='resultsText'>Time: </div>
              <div className='resultsText'>Tuples sorted: </div>
              <button className='submitButton'> Submit</button>
          </div>
          </div>
        </div>
    </div>
  );
}

export default App;
