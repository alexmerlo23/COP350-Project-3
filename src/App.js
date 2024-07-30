import React, { useState } from 'react';
import Papa from 'papaparse';
import './App.css';

function App() {
  const [csvData, setCsvData] = useState([]);
  const [selectedDataType, setSelectedDataType] = useState('');
  const [selectedSortType, setSelectedSortType] = useState('');
  const [sortedData, setSortedData] = useState(null);
  const [columnName, setColumnName] = useState('');

  const handleDataTypeClick = (dataType) => {
    setSelectedDataType(dataType);
    let column;
    switch (dataType) {
      case 'Movie popularities':
        column = 'popularity';
        break;
      case 'Actor Names(lexographically)':
        column = 'actor_name';
        break;
      case 'Cars (by price)':
        column = 'Price (USD)';
        break;
      default:
        return;
    }
    setColumnName(column);
    fetchCsv(dataType, column);
  };

  const handleSortTypeClick = (sortType) => {
    setSelectedSortType(sortType);
  };

  const handleSubmit = () => {
    if (!selectedDataType || !selectedSortType) {
      alert('Please select both a data type and a sort type.');
      return;
    }

    let sorted = [...csvData];
    let startTime, endTime, timeTaken;

    switch (selectedSortType) {
      case 'Merge sort':
        startTime = performance.now();
        sorted = mergeSort(sorted);
        endTime = performance.now();
        break;
      case 'Quick sort':
        startTime = performance.now();
        sorted = quickSort(sorted);
        endTime = performance.now();
        break;
      case 'Shell sort':
        startTime = performance.now();
        sorted = shellSort(sorted);
        endTime = performance.now();
        break;
      default:
        break;
    }

    timeTaken = endTime - startTime;
    setSortedData(sorted);

    const timeInSeconds = (timeTaken / 1000).toFixed(6);
    
    // Update the results section with the time taken
    document.querySelector('.resultsText').textContent = `Time: ${timeInSeconds} seconds`;
  };

  const mergeSort = (data) => {
    if (data.length <= 1) {
      return data;
    }
  
    const middle = Math.floor(data.length / 2);
    const left = data.slice(0, middle);
    const right = data.slice(middle);
  
    return merge(mergeSort(left), mergeSort(right));
  };
  
  const merge = (left, right) => {
    let result = [];
    let leftIndex = 0;
    let rightIndex = 0;
  
    // Merge the two sorted arrays into one
    while (leftIndex < left.length && rightIndex < right.length) {
      if (left[leftIndex] < right[rightIndex]) {
        result.push(left[leftIndex]);
        leftIndex++;
      } else {
        result.push(right[rightIndex]);
        rightIndex++;
      }
    }
  
    // Concatenate any remaining elements
    return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
  };
  

  const quickSort = (data) => {
    if (data.length <= 1) return data;
    const pivot = data[Math.floor(data.length / 2)];
    const left = data.filter(x => x < pivot);
    const right = data.filter(x => x > pivot);
    return [...quickSort(left), pivot, ...quickSort(right)];
  };

  const shellSort = (data) => {
    let n = data.length;
    let gap = Math.floor(n / 2);
    while (gap > 0) {
      for (let i = gap; i < n; i++) {
        let temp = data[i];
        let j;
        for (j = i; j >= gap && data[j - gap] > temp; j -= gap) {
          data[j] = data[j - gap];
        }
        data[j] = temp;
      }
      gap = Math.floor(gap / 2);
    }
    return data;
  };

  const fetchCsv = (dataType, column) => {
    let csvFile = '';
    switch(dataType) {
      case 'Movie popularities':
        csvFile = 'movie_data.csv';
        break;
      case 'Actor Names(lexographically)':
        csvFile = './actor_names.csv';      //This does not exist. Could change to another data set.
        break;
      case 'Cars (by price)':
        csvFile = 'car_data.csv';
        break;
      default:
        return;
    }

    fetch(csvFile)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.text();
      })
      .then(data => {
        const parsedData = Papa.parse(data, { header: true, skipEmptyLines: true });
        const columnData = parsedData.data.map(row => row[column]).filter(value => value !== undefined);
        console.log('Fetched CSV Data:', columnData);
        setCsvData(columnData);
      })
      .catch(error => console.error('Error fetching the CSV file:', error));
  };

  const buttonClass = (type, selectedType) => {
    return type === selectedType ? 'sortButton selected' : 'sortButton';
  };

  return (
    <div className="App">
      <h1 className='title'>DSA Project 3</h1>
        <div className='sectionsContainer'>
          <div className='section'>
            <div className='sectionTitle'>Sort Type</div>
            <div className='sortButtonsContainer'>
              <button className={buttonClass('Merge sort', selectedSortType)} onClick={() => handleSortTypeClick('Merge sort')}>Merge sort</button>
              <button className={buttonClass('Quick sort', selectedSortType)} onClick={() => handleSortTypeClick('Quick sort')}>Quick sort</button>
              <button className={buttonClass('Shell sort', selectedSortType)} onClick={() => handleSortTypeClick('Shell sort')}>Shell sort</button>
            </div>
          </div>
          <div className='section'>
            <div className='sectionTitle'>Data Type</div>
            <div className='sortButtonsContainer'>
              <button className={buttonClass('Movie popularities', selectedDataType)} onClick={() => handleDataTypeClick('Movie popularities')}>Movie popularities</button>
              <button className={buttonClass('Actor Names(lexographically)', selectedDataType)} onClick={() => handleDataTypeClick('Actor Names(lexographically)')}>Actor Names(lexographically)</button>
              <button className={buttonClass('Cars (by price)', selectedDataType)} onClick={() => handleDataTypeClick('Cars (by price)')}>Cars (by price)</button>
            </div>
          </div>
          <div className='section'>
            <div className='sectionTitle'>Results</div>
            <div className='resultsContainer'>
              <div className='resultsText'>Time: </div>
              <div className='resultsText'>Tuples sorted: {csvData ? csvData.length : 0}</div>
              <button className='submitButton' onClick={handleSubmit}>Submit</button>
          </div>
          </div>
        </div>
    </div>
  );
}

export default App;
