import React, { useState } from "react";
import axios from "axios";

function App() {
  const [inputData, setInputData] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);

  const isValidJSON = (str) => {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!isValidJSON(inputData)) {
      setError("Invalid JSON format");
      return;
    }

    try {
      const response = await axios.post(
        "https://bfhl-backend-r5kh.onrender.com/bfhl",
        JSON.parse(inputData)
      );
      setResponseData(response.data);
      setError("");
    } catch (error) {
      console.error("Error submitting data:", error);
      setError("Error submitting data");
    }
  };

  const handleOptionChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedOptions([...selectedOptions, value]);
    } else {
      setSelectedOptions(selectedOptions.filter((option) => option !== value));
    }
  };

  const renderFilteredResponse = () => {
    if (!responseData) return null;

    const { alphabets, numbers, highest_lowercase_alphabet } = responseData;
    let filteredResponse = {};

    if (selectedOptions.includes("Alphabets")) {
      filteredResponse.alphabets = alphabets;
    }
    if (selectedOptions.includes("Numbers")) {
      filteredResponse.numbers = numbers;
    }
    if (selectedOptions.includes("Highest Lowercase Alphabet")) {
      filteredResponse.highestLowercase = highest_lowercase_alphabet;
    }

    return (
      <div>
        {filteredResponse.alphabets && (
          <div>
            <h3>Alphabets</h3>
            <ul>
              {filteredResponse.alphabets.map((alphabet, index) => (
                <li key={index}>{alphabet}</li>
              ))}
            </ul>
          </div>
        )}
        {filteredResponse.numbers && (
          <div>
            <h3>Numbers</h3>
            <ul>
              {filteredResponse.numbers.map((number, index) => (
                <li key={index}>{number}</li>
              ))}
            </ul>
          </div>
        )}
        {filteredResponse.highestLowercase && (
          <div>
            <h3>Highest Lowercase Alphabet</h3>
            <p>{filteredResponse.highestLowercase}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>21BAI1706 - JSON API Interaction</h1>
      <textarea
        rows="10"
        cols="50"
        value={inputData}
        onChange={(e) => setInputData(e.target.value)}
        placeholder="Enter JSON here..."
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />
      <br />
      <button
        onClick={handleSubmit}
        style={{ padding: "10px 20px", cursor: "pointer" }}
      >
        Submit
      </button>

      {error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>}

      {responseData && (
        <div style={{ marginTop: "20px" }}>
          <h2>Filter Response:</h2>
          <div style={{ marginBottom: "10px" }}>
            <label>
              <input
                type="checkbox"
                value="Alphabets"
                onChange={handleOptionChange}
                style={{ marginRight: "5px" }}
              />
              Alphabets
            </label>
            <label style={{ marginLeft: "10px" }}>
              <input
                type="checkbox"
                value="Numbers"
                onChange={handleOptionChange}
                style={{ marginRight: "5px" }}
              />
              Numbers
            </label>
            <label style={{ marginLeft: "10px" }}>
              <input
                type="checkbox"
                value="Highest Lowercase Alphabet"
                onChange={handleOptionChange}
                style={{ marginRight: "5px" }}
              />
              Highest Lowercase Alphabet
            </label>
          </div>
          {renderFilteredResponse()}
        </div>
      )}
    </div>
  );
}

export default App;
