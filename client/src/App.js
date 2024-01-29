import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

function App() {
  const [logData, setLogData] = useState([]);

  useEffect(() => {
    const socket = io("ws://localhost:8080");

    socket.on('update-log', (data) => {
      console.log("html on", data);
      setLogData((prevLogData) => [...prevLogData, ...data]);
    });

    socket.on('init', (data) => {
      console.log("html init", data);
      setLogData(data);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Log monitoring app</h1>
      <div id="message-container">
        {logData.map((elem, index) => (
          <div style={{ display: "flex", justifyContent: "space-between"}}>
            <p style={{ margin: "0 20px", display: "flex", alignItems: "center"}}>{index + 1}</p>
            <p key={index}>{elem}</p>
          </div>
        ))}
      </div>
      </header>
    </div>
  );
}

export default App;
