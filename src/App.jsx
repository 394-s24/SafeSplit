import { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import {db} from './FireBase.js';
import { ref, onValue } from "firebase/database";
import { useEffect } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Card from 'react-bootstrap/Card';


const App = () => {
  const [ gameSnapshot, setGameSnapshot ] = useState();

    useEffect(() => {

        const gamesRef = ref(db);
        onValue(gamesRef, (snapshot) => {
            setGameSnapshot(snapshot.val());
        });
    });
  
  // Make sure gameSnapshot has loaded and contains data
  if (!gameSnapshot) {
    return <div>Loading...</div>;
  }

  const user = "johnsmith@gmail.com"

  var reqData = Array()
  for (let i = 0; i < Object.keys(gameSnapshot["requests"]).length; i++){
    if (gameSnapshot["requests"][i].email == user) {
      const matchFrom = gameSnapshot["requests"][i].locationFrom;
      const matchTo = gameSnapshot["requests"][i].locationTo;
      const numRiders = gameSnapshot["requests"][i].numRiders;
      const matchTimeStart = gameSnapshot["matches"][i].timeStart;
      var matchStart = new Date(matchTimeStart * 1000).toLocaleString();
      const matchTimeEnd = gameSnapshot["matches"][i].timeEnd;
      var matchEnd = new Date(matchTimeEnd * 1000).toLocaleString();
      const status = gameSnapshot["requests"][i].status;
      reqData.push([matchStart, matchEnd, matchFrom, matchTo, user, numRiders, status])
      // reqData.([user, matchFrom, matchTo, matchStart, matchEnd, numRiders, count, status])
    } 

    reqData.sort() 
  }

  var matchData = Array()
  for (let i = 0; i < Object.keys(gameSnapshot["matches"]).length; i++){
    let riderArr = Array(); 
    if (gameSnapshot["matches"][i].rider1 != undefined) {
      riderArr.push(gameSnapshot["matches"][i].rider1);
    }
    if (gameSnapshot["matches"][i].rider2 != undefined) {
      riderArr.push(gameSnapshot["matches"][i].rider2);
    }
    if (gameSnapshot["matches"][i].rider3 != undefined) {
      riderArr.push(gameSnapshot["matches"][i].rider3);
    }
    if (riderArr.includes(user)){
      const matchFrom = gameSnapshot["matches"][i].locationFrom;
      const matchTo = gameSnapshot["matches"][i].locationTo;
      const matchTimeStart = gameSnapshot["matches"][i].timeStart;
      var matchStart = new Date(matchTimeStart * 1000).toLocaleString();
      const matchTimeEnd = gameSnapshot["matches"][i].timeEnd;
      var matchEnd = new Date(matchTimeEnd * 1000).toLocaleString();
      // matchData.push([riderArr, matchFrom, matchTo, matchStart, matchEnd])
      matchData.push([matchStart, matchEnd, matchFrom, matchTo, riderArr])
    }

    matchData.sort()
  }
  // Accessing just the rider1 field from the first object in gameSnapshot
  


  
  return (
    <html>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
          integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN"
          crossorigin="anonymous"
        />
      </head>
        <Tabs
        defaultActiveKey="request"
        id="uncontrolled-tab-example"
        className="mb-3">
        <Tab eventKey="request" title="Request">
        {reqData.map(item => (
          <Card style={{ width: '30rem' }}>
            <Card.Body>
              <Card.Title>Request</Card.Title>
              
              <Card.Subtitle className="mb-2 text-muted">{item[0]}
              </Card.Subtitle>
              <Card.Subtitle className="mb-2 text-muted">Riders: {item[5]}
              </Card.Subtitle>
              <Card.Title>From: {item[2]}</Card.Title>
              <Card.Title>To: {item[3]}</Card.Title>
              <Card.Text>
                Time: {item[0]} - {item[1]}
              </Card.Text>
              <Card.Subtitle className="mb-2 text-muted">Status: {item[6]}
              </Card.Subtitle>
            </Card.Body>
          </Card>
          ))}
        </Tab>
        <Tab eventKey="matches" title="Matches">
        {matchData.map(item => (
          <Card style={{ width: '30rem' }}>
            <Card.Body>
              <Card.Title>Match</Card.Title>
              
              <Card.Subtitle className="mb-2 text-muted">{item[4].map(rider => (<span>{rider} </span> ))}
              </Card.Subtitle>
              <Card.Title>From: {item[2]}</Card.Title>
              <Card.Title>To: {item[3]}</Card.Title>
              <Card.Text>
                Time: {item[0]} - {item[1]}
              </Card.Text>
            </Card.Body>
          </Card>
          ))}
        {/* <Card style={{ width: '18rem' }}>
            <Card.Body>
              <Card.Title>Match #1</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">{rider1}, {rider2}</Card.Subtitle>
              <Card.Title>From: {matchFrom}</Card.Title>
              <Card.Title>To: {matchTo}</Card.Title>
              <Card.Text>
                Time: {matchStart} <br></br> {matchEnd}
              </Card.Text>
            </Card.Body>
          </Card> */}


        </Tab>
      </Tabs>
    </html>
  );

};


export default App;
