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
      case 'Movie Name A-Z':
        column = 'movie_name';
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

    // Filter out movies with null or empty names
    let filteredData = csvData.filter(name => name && name.trim() !== '');
    let sorted = [...filteredData];
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
      case 'Radix sort':
        startTime = performance.now();
        sorted = radixSort(sorted);
        endTime = performance.now();
        break;

      default:
        break;
    }

    timeTaken = endTime - startTime;
    setSortedData(sorted);

    const timeInSeconds = (timeTaken / 1000).toFixed(6);

    // Get the names of the first 3 movies, or less if fewer movies exist
    const topMovies = sorted.slice(0, 3).join(', ');
    const last3Movies = sorted.slice(-3).join(', ');

    // Update the results section with the time taken and the top 3 movies
    document.querySelector('.resultsTime').textContent = `Time: ${timeInSeconds} seconds`;
    document.querySelector('.resultsTuples').textContent = `Tuples sorted: ${filteredData.length}`;
    document.querySelector('.resultsTopMovies').textContent = `Top 3 Movies: ${topMovies}`;
    document.querySelector('.resultsLastMovies').textContent = `Last 3 Movies: ${last3Movies}`;
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

  const getMax = (data) => {
    let max = data[0];
    for (let i = 1; i < data.length; i++) {
      if (data[i] > max) {
        max = data[i];
      }
    }
    return max;
  };

  const countSort = (data, exp) => {
    const n = data.length;
    const output = new Array(n).fill(0);  // Output array to store sorted numbers
    const count = new Array(10).fill(0);  // Count array to store occurrences of digits

    // Store the count of occurrences in count[]
    for (let i = 0; i < n; i++) {
      const index = Math.floor(data[i] / exp) % 10;
      count[index]++;
    }

    // Change count[i] so that it now contains the actual position of this digit in the output array
    for (let i = 1; i < 10; i++) {
      count[i] += count[i - 1];
    }

    // Build the output array by sorting the data according to the current digit
    for (let i = n - 1; i >= 0; i--) {
      const index = Math.floor(data[i] / exp) % 10;
      output[count[index] - 1] = data[i];
      count[index]--;
    }

    // Copy the output array to data[], so that data now contains sorted numbers according to the current digit
    for (let i = 0; i < n; i++) {
      data[i] = output[i];
    }
  };
  const radixSort = (data) => {
    data = data.filter(Number.isInteger);

    if (data.length === 0) return data;

    // Find the maximum number to determine the number of digits
    const max = getMax(data);

    // Do counting sort for every digit. exp is 10^i where i is the current digit number
    for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
      countSort(data, exp);
    }

    return data;
  };

  const fetchCsv = (dataType, column) => {
    let csvFile = '';
    switch(dataType) {
      case 'Movie popularities':
        csvFile = 'movie_data.csv';
        break;
      case 'Movie Name A-Z':
        csvFile = 'movie_data.csv';
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
        <h1 className='title'> DSA Project 3</h1>
        <div className='sectionsContainer'>
          <div className='section'>
            <div className='sectionTitle'>Sort Type</div>
            <div className='sortButtonsContainer'>
              <button className={buttonClass('Merge sort', selectedSortType)} onClick={() => handleSortTypeClick('Merge sort')}>Merge sort</button>
              <button className={buttonClass('Quick sort', selectedSortType)} onClick={() => handleSortTypeClick('Quick sort')}>Quick sort</button>
              <button className={buttonClass('Shell sort', selectedSortType)} onClick={() => handleSortTypeClick('Shell sort')}>Shell sort</button>
              <button className={buttonClass('Radix sort', selectedSortType)} onClick={() => handleSortTypeClick('Radix sort')}>Radix sort</button>
            </div>
          </div>
          <div className='section'>
            <div className='sectionTitle'>Data Type</div>
            <div className='sortButtonsContainer'>
              <button className={buttonClass('Movie popularities', selectedDataType)} onClick={() => handleDataTypeClick('Movie popularities')}>Movie popularities</button>
              <button className={buttonClass('Movie Name A-Z', selectedDataType)} onClick={() => handleDataTypeClick('Movie Name A-Z')}>Movie Name A-Z</button>
              <button className={buttonClass('Cars (by price)', selectedDataType)} onClick={() => handleDataTypeClick('Cars (by price)')}>Cars (by price)</button>
            </div>
          </div>
          <div className='section'>
            <div className='sectionTitle'>Results</div>
            <div className='resultsContainer'>
              <div className='resultsTime'>Time: </div>
              <div className='resultsTuples'>Tuples sorted: {csvData ? csvData.length : 0}</div>
              <div className='resultsTopMovies'>Top 3 Movies: </div>
              <div className='resultsLastMovies'>Last 3 Movies: </div>
              <button className='submitButton' onClick={handleSubmit}>Submit</button>
            </div>
          </div>
        </div>
      </div>
  );
}

export default App;
