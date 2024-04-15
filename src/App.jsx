import { useState } from "react";
import { db } from "./FireBase.js";
import { ref, onValue } from "firebase/database";
import { useEffect } from "react";
import RideForm from "./components/Form/RideForm.jsx";
import DataLogger from "./components/DataLogger/DataLogger.jsx";
import { Container, Spinner, Row } from "react-bootstrap";

import "./App.css";

const App = () => {
  const [gameSnapshot, setGameSnapshot] = useState();
  useEffect(() => {
    const gamesRef = ref(db);
    onValue(gamesRef, (snapshot) => {
      setGameSnapshot(snapshot.val());
    });
  }, []);

  // Make sure gameSnapshot has loaded and contains data
  if (!gameSnapshot) {
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
  for (let i = 0; i < Object.keys(gameSnapshot["requests"]).length; i++) {
    // Object.keys(gameSnapshot["requests"]).forEach((i) => {
    if (gameSnapshot["requests"][i].email == user) {
      const matchFrom = gameSnapshot["requests"][i].locationFrom;
      const matchTo = gameSnapshot["requests"][i].locationTo;
      const numRiders = gameSnapshot["requests"][i].numRiders;
      const matchTimeStart = gameSnapshot["requests"][i].requestTimeStart;
      var matchStart = new Date(matchTimeStart * 1000).toLocaleString();
      // var matchStart = new Date(matchTimeStart ).toLocaleString();

      const matchTimeEnd = gameSnapshot["requests"][i].requestTimeEnd;
      var matchEnd = new Date(matchTimeEnd * 1000).toLocaleString();
      // var matchEnd = new Date(matchTimeEnd).toLocaleString();

      const status = gameSnapshot["requests"][i].status;
      reqData.push([
        matchStart,
        matchEnd,
        matchFrom,
        matchTo,
        user,
        numRiders,
        status,
        i + 1,
      ]);
    }
    reqData.sort((a, b) => new Date(a[0]) - new Date(b[0]));
  }

  var matchData = Array();
  // fixed for nonconsecutive indices
  for (let i = 0; i < Object.keys(gameSnapshot["matches"]).length; i++) {
    // Object.keys(gameSnapshot["matches"]).forEach((i) => {

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
    if (riderArr.includes(user)) {
      const matchFrom = gameSnapshot["matches"][i].locationFrom;
      const matchTo = gameSnapshot["matches"][i].locationTo;
      const matchTimeStart = gameSnapshot["matches"][i].timeStart;
      var matchStart = new Date(matchTimeStart * 1000).toLocaleString();
      const matchTimeEnd = gameSnapshot["matches"][i].timeEnd;
      var matchEnd = new Date(matchTimeEnd * 1000).toLocaleString();
      // matchData.push([riderArr, matchFrom, matchTo, matchStart, matchEnd])
      matchData.push([
        matchStart,
        matchEnd,
        matchFrom,
        matchTo,
        riderArr,
        i + 1,
      ]);
    }

    matchData.sort((a, b) => new Date(a[0]) - new Date(b[0]));
  }
  // Accessing just the rider1 field from the first object in gameSnapshot
  // console.log(gameSnapshot)
  return (
    <Container>
      <RideForm
        currMaxId={Object.keys(gameSnapshot["requests"]).length}
        currMaxMatchId={Object.keys(gameSnapshot["matches"]).length}
        data={gameSnapshot}
      />
      <DataLogger reqData={reqData} matchData={matchData} />
    </Container>
  );
};

export default App;
