import { useState } from "react";
import { db } from "../../FireBase.js";
import { ref, onValue } from "firebase/database";
import { useEffect } from "react";
import RideForm from "../Form/RideForm.jsx";
import DataLogger from "../DataLogger/DataLogger.jsx";
import { Container, Spinner, Row } from "react-bootstrap";
import "./App.css";

const App = () => {
  const [FirebaseData, setFirebaseData] = useState();

  useEffect(() => {
    const firebaseRef = ref(db);
    onValue(firebaseRef, (snapshot) => {
      setFirebaseData(snapshot.val());
    });
  }, []);

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
  for (let i = 0; i < Object.keys(FirebaseData["requests"]).length; i++) {
    const {
      locationFrom,
      locationTo,
      numRiders,
      requestTimeStart,
      requestTimeEnd,
      status,
    } = FirebaseData["requests"][i];

    if (FirebaseData["requests"][i].email == user) {
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
        i + 1,
      ]);
    }
    reqData.sort((a, b) => new Date(a[0]) - new Date(b[0]));
  }

  var matchData = Array();
  // fixed for nonconsecutive indices
  for (let i = 0; i < Object.keys(FirebaseData["matches"]).length; i++) {
    const { locationFrom, locationTo, rider1, rider2, rider3 } =
      FirebaseData["matches"][i];

    let riderArr = Array();

    rider1 ? riderArr.push(rider1) : null;
    rider2 ? riderArr.push(rider2) : null;
    rider3 ? riderArr.push(rider3) : null;

    if (riderArr.includes(user)) {
      var matchStart = new Date(currentMatch.timeStart * 1000).toLocaleString();
      var matchEnd = new Date(currentMatch.timeEnd * 1000).toLocaleString();
      matchData.push([
        matchStart,
        matchEnd,
        locationFrom,
        locationTo,
        riderArr,
        i + 1,
      ]);
    }

    matchData.sort((a, b) => new Date(a[0]) - new Date(b[0]));
  }
  // Accessing just the rider1 field from the first object in FirebaseData
  // console.log(FirebaseData)
  return (
    <Container>
      <RideForm
        currMaxId={Object.keys(FirebaseData["requests"]).length}
        currMaxMatchId={Object.keys(FirebaseData["matches"]).length}
        data={FirebaseData}
      />
      <DataLogger reqData={reqData} matchData={matchData} />
    </Container>
  );
};

export default App;
