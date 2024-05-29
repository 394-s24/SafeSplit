import { useState } from "react";
import { FetchData, formatData } from "../../utilities/FireBase.js";
import { useEffect } from "react";
import RideForm from "../RideForm/RideForm.jsx";
import DataLogger from "../DataLogger/DataLogger.jsx";
import { Container, Spinner, Row } from "react-bootstrap";
import "./App.css";
import NavBar from "../NavBar/NavBar.jsx";
import { ChakraProvider } from "@chakra-ui/react";

const App = () => {
  const [FirebaseData, setFirebaseData] = useState({
    requests: [],
    matches: [],
  });
  const [key, setKey] = useState("request");
  const [user, setUser] = useState("johnsmith@gmail.com");

  const getData = async () => {
    const data = await FetchData();

    setFirebaseData(data)

    return data
  }

  useEffect(() => {
    getData()
  }, []);

  let foundMaxMatchId = 0;
  let foundMaxRequestId = 0;

  // // Make sure FirebaseData has loaded and contains data
  // if (!FirebaseData) {
  //   return (
  //     <Container className="spinner-container">
  //       <Row>
  //         <Spinner animation="border" role="primary">
  //           <span className="visually-hidden">Loading...</span>
  //         </Spinner>
  //       </Row>
  //     </Container>
  //   );
  // }

  if (FirebaseData["requests"] == undefined) {
    setFirebaseData({
      requests: [],
      matches: [],
    });
  }

  //console.log(FirebaseData["requests"])
  //console.log("In app",FirebaseData);

  const data = formatData(FirebaseData, user); 
  console.log(data)

  // Accessing just the rider1 field from the first object in FirebaseData
  // console.log(FirebaseData)
  // max id for new request
  //foundMaxRequestId++;

  foundMaxMatchId = data["foundMaxMatchId"];
  foundMaxRequestId = data["foundMaxRequestId"] + 1;

  return (
    <ChakraProvider>
      <div>
        <NavBar user={user} setUser={setUser} />
        <Container>
          <RideForm
            currMaxId={foundMaxRequestId}
            currMaxMatchId={foundMaxMatchId}
            data={FirebaseData}
            tabKey={key}
            setTabKey={setKey}
            user={user}
          />
          <Row>
            <DataLogger
              reqData={data["reqData"]}
              matchData={data["matchData"]}
              tabKey={key}
              setTabKey={setKey}
              firebaseData={FirebaseData}
            />
          </Row>
        </Container>
      </div>
    </ChakraProvider>
  );
};

export default App;
