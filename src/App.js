import React, { useState } from 'react';
import Papa from 'papaparse';
import './App.css';

function App() {
  const [csvData, setCsvData] = useState([]);
  const [selectedDataType, setSelectedDataType] = useState('');
  const [selectedSortType, setSelectedSortType] = useState('');
  const [sortedData, setSortedData] = useState(null);
  const [columnName, setColumnName] = useState(''); // State to hold the column name

  const handleDataTypeClick = (dataType) => {
    setSelectedDataType(dataType);
    // Set column name based on data type
    let column;
    switch (dataType) {
      case 'Movie popularities':
        column = 'popularity';
        break;
      case 'Actor Names(lexographically)':
        column = 'actor_name'; // Example column name
        break;
      case 'Cars (by price)':
        column = 'Price (USD)'; 
        break;
      default:
        return;
    }
    setColumnName(column); // Set the column name
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

    // Example sorting logic based on selected sort type
    let sorted = [...csvData];
    switch (selectedSortType) {
      case 'Merge sort':
        sorted = mergeSort(sorted);
        break;
      case 'Quick sort':
        sorted = quickSort(sorted);
        break;
      case 'Shell sort':
        sorted = shellSort(sorted);
        break;
      default:
        break;
    }
    setSortedData(sorted);
  };

  // Implement your sorting algorithms here
  const mergeSort = (data) => {
     // Log each item in the data for testing
     console.log("Merge sort data:");
     data.forEach(item => console.log(item));
     // For now, return the unmodified data
     return data;
  };

  const quickSort = (data) => {
    // Your quick sort logic
    console.log("quick");
    return data;
  };

  const shellSort = (data) => {
    // Your shell sort logic
    console.log("shell");
    return data;
  };

  const fetchCsv = (dataType, column) => {
    let csvFile = '';
    switch(dataType) {
      case 'Movie popularities':
        csvFile = './data/movie_data.csv';  // Ensure path is correct
        break;
      case 'Actor Names(lexographically)':
        csvFile = '/data/actor_names.csv';  // Ensure path is correct
        break;
      case 'Cars (by price)':
        csvFile = './data/car_data.csv';  // Ensure path is correct
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
        console.log('Raw CSV data:', data); // Log raw CSV data
        const parsedData = Papa.parse(data, { header: true, skipEmptyLines: true });
        console.log('Parsed data:', parsedData); // Log parsed data
        const columnData = parsedData.data.map(row => row[column]).filter(value => value !== undefined);
        console.log('Fetched CSV Data:', columnData); // Log fetched data
        setCsvData(columnData); // Set csvData to the selected column data
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
              <div className='resultsText'>Tuples sorted: </div>
              <button className='submitButton' onClick={handleSubmit}>Submit</button>
          </div>
          </div>
        </div>
    </div>
  );
}

export default App;
