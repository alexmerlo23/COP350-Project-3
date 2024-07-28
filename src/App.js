import React, { useState } from 'react';
import './App.css';
import Container from './Container';

function App() {
  const [time, setTime] = useState(null);
  const [selectedSort, setSelectedSort] = useState(null);
  const [data, setData] = useState([]);

  const updateTime = (timeTaken) => {
    setTime(timeTaken);
  };

  const updateSelectedSort = (sortIndex) => {
    setSelectedSort(sortIndex);
  };

  const updateData = (sortedData) => {
    setData(sortedData);
  };

  return (
    <div className="app">
      <div className="container-wrapper">
        <Container
          title="Container 1"
          items={['Merge sort', 'Shell sort', 'Quick sort']}
          type="buttons"
          updateTime={updateTime}
          updateSelectedSort={updateSelectedSort}
          updateData={updateData}
          rawData={data}
        />
        <Container
          title="Container 2"
          items={['Actors(A-Z)', 'Movie titles', 'Ratings', 'Popularity']}
          type="buttons"
        />
        <Container
          title="Container 3"
          items={[
            `Time: ${time ? `${time.toFixed(2)} ms` : ''}`,
            'Tuples sorted: ',
          ]}
          type="text"
          showSubmitButton={true}
          selectedSort={selectedSort}
          updateTime={updateTime}
          rawData={data}
        />
      </div>
    </div>
  );
}

export default App;
