import { useState } from "react";
import { db } from "../../utilities/FireBase.js";
import { ref, onValue } from "firebase/database";
import { useEffect } from "react";
import RideForm from "../RideForm/RideForm.jsx";
import DataLogger from "../DataLogger/DataLogger.jsx";
import { Container, Spinner, Row } from "react-bootstrap";
import "./App.css";


const App = () => {
  const [FirebaseData, setFirebaseData] = useState();
  const [key, setKey] = useState('request');

  useEffect(() => {
    const firebaseRef = ref(db);
    onValue(firebaseRef, (snapshot) => {
      setFirebaseData(snapshot.val());
    });
  }, []);

  let foundMaxMatchId = 0;
  let foundMaxRequestId = 0;

  // Make sure FirebaseData has loaded and contains data
  if (!FirebaseData) {
    return (
      <Container className="spinner-container">
        <Row>
          <Spinner animation="border" role="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Row>
      </Container>
    );
  }

  const user = "johnsmith@gmail.com";

  var reqData = Array();
  // fixed for nonconsecutive indices
  for (const [key, value] of Object.entries(FirebaseData["requests"])) {
    foundMaxRequestId < parseInt(key)
      ? (foundMaxRequestId = parseInt(key))
      : null;

    const {
      email,
      locationFrom,
      locationTo,
      numRiders,
      requestTimeStart,
      requestTimeEnd,
      status,
      match_id,
    } = value;

    if (email == user) {
      var matchStart = new Date(requestTimeStart * 1000).toLocaleString();
      var matchEnd = new Date(requestTimeEnd * 1000).toLocaleString();
      reqData.push([
        matchStart,
        matchEnd,
        locationFrom,
        locationTo,
        user,
        numRiders,
        status,
        key,
        match_id,
      ]);
    }
    reqData.sort((a, b) => new Date(a[0]) - new Date(b[0]));
  }

  var matchData = Array();
  // fixed for nonconsecutive indices
  for (const [key, value] of Object.entries(FirebaseData["matches"])) {
    foundMaxMatchId < parseInt(key) ? (foundMaxMatchId = parseInt(key)) : null;

    const {
      timeStart,
      timeEnd,
      locationFrom,
      locationTo,
      rider1,
      rider2,
      rider3,
    } = value;

    let riderArr = Array();

    rider1 ? riderArr.push(rider1) : null;
    rider2 ? riderArr.push(rider2) : null;
    rider3 ? riderArr.push(rider3) : null;

    if (riderArr.includes(user)) {
      var matchStart = new Date(timeStart * 1000).toLocaleString();
      var matchEnd = new Date(timeEnd * 1000).toLocaleString();
      matchData.push([
        matchStart,
        matchEnd,
        locationFrom,
        locationTo,
        riderArr,
        key,
      ]);
    }

    matchData.sort((a, b) => new Date(a[0]) - new Date(b[0]));
  }
  // Accessing just the rider1 field from the first object in FirebaseData
  // console.log(FirebaseData)
  // max id for new request 
  foundMaxRequestId++
  
  return (
    <Container>
      <RideForm
        currMaxId={foundMaxRequestId}
        currMaxMatchId={foundMaxMatchId}
        data={FirebaseData}
        tabKey={key}
        setTabKey = {setKey}
      />
      <Row>
        <DataLogger
          reqData={reqData}
          matchData={matchData}
          tabKey={key}
          setTabKey={setKey}
          firebaseData={FirebaseData}
        />
      </Row>
    </Container>
  );
};

export default App;
