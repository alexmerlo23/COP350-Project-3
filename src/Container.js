import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import './Container.css';

const Container = ({ title, items, type, updateTime, updateSelectedSort, showSubmitButton, selectedSort, updateData, rawData }) => {
  const [data, setData] = useState([]);
  const [selectedButton, setSelectedButton] = useState(null);

  useEffect(() => {
    if (title === "Container 1" || title === "Container 2") {
      fetch('/movie_data.csv')
        .then(response => response.text())
        .then(csvString => {
          Papa.parse(csvString, {
            header: true,
            dynamicTyping: true,
            complete: (result) => {
              setData(result.data);
            },
          });
        });
    }
  }, [title]);

  const handleButtonClick = (index) => {
    setSelectedButton(index);
    if (updateSelectedSort) updateSelectedSort(index);
  };

  const handleSubmit = () => {
    if (selectedSort === null) return;

    console.log('Selected Sort Index:', selectedSort);
    console.log('Raw Data:', rawData);

    const dataToSort = rawData.map(d => ({ popularity: d.popularity })); // Extract popularity data

    let sortedData;
    const startTime = performance.now();
    
    if (selectedSort === 0) {
      sortedData = mergeSort(dataToSort);
    } else if (selectedSort === 1) {
      sortedData = shellSort(dataToSort);
    } else if (selectedSort === 2) {
      sortedData = quickSort(dataToSort);
    }

    const endTime = performance.now();
    const timeTaken = endTime - startTime;
    if (updateTime) updateTime(timeTaken);
    if (updateData) updateData(sortedData);
  };

  const mergeSort = (data) => {
    if (data.length <= 1) return data;

    const middle = Math.floor(data.length / 2);
    const left = data.slice(0, middle);
    const right = data.slice(middle);

    return merge(mergeSort(left), mergeSort(right));
  };

  const merge = (left, right) => {
    let resultArray = [], leftIndex = 0, rightIndex = 0;

    while (leftIndex < left.length && rightIndex < right.length) {
      if (left[leftIndex].popularity < right[rightIndex].popularity) {
        resultArray.push(left[leftIndex]);
        leftIndex++;
      } else {
        resultArray.push(right[rightIndex]);
        rightIndex++;
      }
    }

    return resultArray.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
  };

  const shellSort = (data) => {
    let n = data.length;
    let gap = Math.floor(n / 2);

    while (gap > 0) {
      for (let i = gap; i < n; i++) {
        let temp = data[i];
        let j;
        for (j = i; j >= gap && data[j - gap].popularity > temp.popularity; j -= gap) {
          data[j] = data[j - gap];
        }
        data[j] = temp;
      }
      gap = Math.floor(gap / 2);
    }

    return data;
  };

  const quickSort = (data) => {
    if (data.length <= 1) return data;

    let pivot = data[Math.floor(data.length / 2)].popularity;
    let left = [];
    let right = [];

    for (let i = 0; i < data.length; i++) {
      if (i !== Math.floor(data.length / 2)) {
        if (data[i].popularity < pivot) {
          left.push(data[i]);
        } else {
          right.push(data[i]);
        }
      }
    }

    console.log("Hi");
    return quickSort(left).concat([data[Math.floor(data.length / 2)]]).concat(quickSort(right));
  };

  return (
    <div className="container">
      <h2>{title}</h2>
      {type === 'buttons' ? (
        <div className="button-container">
          {items.map((item, index) => (
            <button
              key={index}
              className={selectedButton === index ? 'selected' : ''}
              onClick={() => handleButtonClick(index)}
            >
              {item}
            </button>
          ))}
        </div>
      ) : (
        <ul className="spaced-items">
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}
      {showSubmitButton && (
        <button onClick={handleSubmit} className="submit-button">Submit</button>
      )}
    </div>
  );
};

export default Container;
