'use client';  // Indicate this is a client component

import { useEffect, useState } from "react";
import { highlightText } from '@/utils/highlightText'; // Import the highlightText function

type LogType = {
  _id: string;
  logLevel: string;
  message: string;
  fileName: string;
  Server: string;
  time: string; 
};

const Home = () => {
  const [searchTerms, setSearchTerms] = useState<string[]>([""]);  // Start with one empty search term
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [filename, setFilename] = useState<string>("");
  const [logs, setLogs] = useState<LogType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [detailListLog, setDetailLog] = useState<LogType[]>([]);
  const [selectedLogId, setSelectedLogId] = useState<string>("");
  const [collectionName, setCollectionsName] = useState<string[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string>("");

  useEffect(() => {
    const fetchCollections = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/collection`);
        const data = await response.json();
        console.log(data);
        setCollectionsName(data.collections);
      } catch (error) {
        console.error("Error fetching logs:", error);
        setCollectionsName([]);
      } finally {
        setLoading(false);
      }
    };
  
    fetchCollections(); 
    
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  

  // Fetch logs based on search terms, date range, and filename regex
  const fetchLogs = async () => {
    setLoading(true);
    try {
      console.log("selectedCollection:", selectedCollection);
      if(selectedCollection == "") {
        setLogs([]);
        alert("Please choose a collection");
        return;
      }
      
      const response = await fetch(`/api/search?query=${searchTerms.join(' ')}&startDate=${startDate}&endDate=${endDate}&filename=${filename}&collection=${selectedCollection}`);
      const data = await response.json();
      setLogs(data);
    } catch (error) {
      console.error("Error fetching logs:", error);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle adding a new search term
  const handleAddTerm = () => {
    setSearchTerms([...searchTerms, ""]); // Add an empty string to the array
  };

  // Handle removing a search term
  const handleRemoveTerm = (index: number) => {
    const updatedTerms = searchTerms.filter((_, i) => i !== index);  // Remove the term at the given index
    setSearchTerms(updatedTerms);
  };

  // Handle changing a specific search term
  const handleSearchTermChange = (index: number, newTerm: string) => {
    // Allow only letters and numbers (no spaces or special characters)
    const sanitizedTerm = newTerm.replace(/[^a-zA-Z0-9]/g, "");
  
    // Update the searchTerms array with the sanitized term
    const updatedTerms = [...searchTerms];
    updatedTerms[index] = sanitizedTerm;
    
    setSearchTerms(updatedTerms);
  };

  // Trigger search when the search button is clicked
  const handleSearch = () => {
    if (searchTerms.length > 0 && searchTerms.some(term => term.trim())) {
      fetchLogs();
    } else {
      setLogs([]);
      alert("Please add atleast 1 keyword");
      return;
    }
  };

  // Handle pressing the "Enter" key in the search input
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleLogClick = async (id: string) => {
    try {

      setSelectedLogId(id);

      const response = await fetch(`/api/detail?id=${id}&collection=${selectedCollection}`);
      const data = await response.json();
      setDetailLog(data); 

    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };
  
  const closeModal = () => {
    setDetailLog([]);
  };

  return (
    <div>
      <h1 style={{textAlign: 'center'}}><b>Search Logs</b></h1>

      <div className="w-[500px] mx-auto p-4 border rounded-lg">

        {/* Collection Name */}
        <div className="mb-1">
          <label className="mr-2">Collection Name:</label>
        </div>
        <div className="flex items-center mb-4">
          <select
            id="collectionName"
            value={selectedCollection}
            onChange={(e) => setSelectedCollection(e.target.value)}
            className={`border p-2 flex-grow ${selectedCollection === "" ? "border-red-500" : "border-gray-300"}`}
          >
            <option value="" disabled hidden>Select a collection</option>
            {collectionName.map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>
        </div>

        {/* Filename Regex Input */}
        <div className="mb-1">
          <label className="mr-2">File Name:</label>
        </div>
        <div className="flex items-center mb-4">
          <input
            id="filename"
            type="text"
            placeholder="Enter filename regex"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            onKeyDown={handleKeyPress}
            style={{ flexGrow: 1 }} // Makes input take up remaining space
          />
        </div>

        {/* Start Date */}
        <div className="mb-1">
          <label className="mr-2">Start Date:</label>
        </div>
        <div className="flex items-center mb-4">
          <input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{ flexGrow: 1 }} // Makes input take up remaining space
          />
        </div>

        {/* End Date */}
        <div className="mb-1">
          <label className="mr-2">End Date:</label>
        </div>
        <div className="flex items-center mb-4">
          <input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{ flexGrow: 1 }} // Makes input take up remaining space
          />
        </div>

        {/* Render search terms dynamically */}
        <div>
          <div className="mb-2 mt-8">
            <label className="mr-2">Keyword:</label>
          </div>
          {searchTerms.map((term, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="text"
                value={term}
                placeholder={`Search term ${index + 1}`}
                onChange={(e) => handleSearchTermChange(index, e.target.value)}
                onKeyDown={handleKeyPress}
                style={{ flexGrow: 1, marginRight: '10px' }}
              />
              {/* Remove term button */}
              <button 
                onClick={() => handleRemoveTerm(index)} 
                style={{ backgroundColor: '#ff0101', color: '#fff', padding: '0 22px' }}
              >
                -
              </button>
            </div>
          ))}

          {/* Add new search term button */}
          <div className="flex justify-end mb-4"> {/* Right-aligns the "+" button */}
            <button
              onClick={handleAddTerm}
              style={{ backgroundColor: '#00cafe', color: '#fff', padding: '0 20px' }}
            >
              +
            </button>
          </div>
        </div>

        {/* Search Button */}
        <div className="mt-4">
          <button
            onClick={handleSearch}
            style={{ backgroundColor: '#00b65b', color: '#fff', padding: '0 20px', width: '100%' }}
          >
            Search
          </button>
        </div>
      </div>


      {/* Show loading indicator */}
      {loading ? (
        <p style={{margin:'20px'}}>Loading... ({logs.length} items fetched so far)</p>
      ) : (
        <p style={{margin:'20px'}}>Total logs: {logs.length}</p>
      )}

      {/* Display logs */}
      <ul style={{margin:'20px'}}>
        {logs.length > 0 ? (
          logs.map((log) => (
            <li 
            key={log._id} 
            onClick={() => handleLogClick(log._id)}
            style={{ border: '1px solid #aaaaaa', padding: '10px', margin: '5px', cursor: 'pointer' }}>
              <strong>{log.logLevel}</strong> - 
              {/* Highlight the matching text in the message */}
              <p dangerouslySetInnerHTML={{ __html: highlightText(log.message, searchTerms.join(' ')) }} style={{ wordWrap: 'break-word', whiteSpace: 'normal' }}></p>
              <p>File: {log.fileName}</p>
              <p>Server: {log.Server}</p>
              <p>Time: {new Date(log.time).toLocaleString()}</p>
            </li>
          ))
        ) : (
          <p>No logs found</p>
        )}
      </ul>

      {/* Modal */}
      {detailListLog.length > 0 && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-hidden"
          style={{ overflow: "hidden" }} // Prevent body scroll
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-[800px] max-h-[80vh] overflow-y-auto"
          >
            <h2 className="text-xl font-bold mb-4">Log Details</h2>

            <ul>
              {detailListLog.map((log) => (
                <li 
                  key={log._id} 
                  onClick={() => handleLogClick(log._id)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") closeModal();
                  }}
                  className={`border border-gray-400 p-2 mb-2 cursor-pointer ${log._id === selectedLogId ? 'bg-green-200' : 'bg-white'}`}
                >
                  <strong>{log.logLevel}</strong> - 
                  <p dangerouslySetInnerHTML={{ __html: highlightText(log.message, searchTerms.join(' ')) }} style={{ wordWrap: 'break-word', whiteSpace: 'normal' }}></p>
                  <p>File: {log.fileName}</p>
                  <p>Server: {log.Server}</p>
                  <p>Time: {new Date(log.time).toLocaleString()}</p>
                </li>
              ))}
            </ul>

            {/* Close Button */}
            <button 
              onClick={closeModal} 
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Home;
