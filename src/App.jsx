import { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import {db} from './FireBase.js';
import { ref, onValue } from "firebase/database";
import { useEffect } from 'react';

const App = () => {
  const [count, setCount] = useState(0);
  const [ gameSnapshot, setGameSnapshot ] = useState();

    useEffect(() => {

        const gamesRef = ref(db, 'requests');
        
        onValue(gamesRef, (snapshot) => {
            
            setGameSnapshot(snapshot.val());
        });
    });
  
  // const data = FetchData();
  // console.log(data);
  return (
    <div >
      <h1>SafeSplit</h1>
      <h2>Requests</h2>
      <pre>{JSON.stringify(gameSnapshot, null, 2)}</pre>
    </div>
   
   
    /*  <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hello Vite + React!</p>
        <p>
          <button onClick={() => setCount(count => count + 1)}>
            count is: {count}
          </button>
        </p>
        <p>
          Edit <code>App.jsx</code> and save to test hot module replacement (HMR).
        </p>
        <p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          {' | '}
          <a
            className="App-link"
            href="https://vitejs.dev/guide/features.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vite Docs
          </a>
        </p>
      </header>
    </div> */
  );
};

export default App;
