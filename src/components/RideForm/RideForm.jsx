import React, { useState } from "react";
import { db } from "../../utilities/FireBase";
import { ref, onValue, set } from "firebase/database";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import DateTimePicker from "react-datetime-picker";
import "./RideForm.css";

const RideForm = ({ currMaxId, currMaxMatchId, data }) => {
  const [locationFrom, setLocationFrom] = useState("");
  const [locationTo, setLocationTo] = useState("");
  const [email, setEmail] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [timeStart, setTimeStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [timeEnd, setTimeEnd] = useState("");
  const [error, setError] = useState("");


  const dbRef = ref(db);
  // console.log(data)
  // console.log(currMaxId)
  // console.log(locationFrom)
  // console.log(locationTo)
  // console.log(dateStart)
  // console.log(dateEnd)

  function firebaseTest(event) {
    event.preventDefault(); // prevent refresh
    console.log(locationFrom);
    console.log(locationTo);

    // // this is working to push to firebase
    // // currMaxId MUST be unique
    // set(ref(db, 'matches/' + 100), {
    //   locationFrom: "Tech",
    //   locationTo: "OHare",
    //   rider1: "johnnyappleseed@gmail.com",
    //   rider2: "gracehopper@gmail.com",
    //   rider3: "",
    //   timeEnd: 1712545200,
    //   timeStart: 1712541600
    // })
  }

  function runAlgorithm(event) {
    event.preventDefault(); // prevent refresh

    // form date validation
    if (dateStart > dateEnd) {
      setError("Earliest pickup date must be before latest pickup date");
      return;
    }
    else if (dateStart == dateEnd && timeStart > timeEnd) {
      setError("Earliest pickup time must be before latest pickup time");
      return;
    }
    else{
      let algorithmStartDate = new Date(dateStart + " " + timeStart);
      let algorithmEndDate = new Date(dateEnd + " " + timeEnd);

      console.log("Running Algorithm");
      // console.log(dateStart.toLocaleString("en-US", {timeZone: "America/Chicago"}));
      // console.log(dateStart.toLocaleString("en-US", {timeZone: "UTC"}));
      // console.log(Math.floor(dateStart.getTime() / 1000));
      // console.log(dateStart);
      const dateStartGMT = Math.floor(algorithmStartDate.getTime() / 1000);
      const dateEndGMT = Math.floor(algorithmEndDate.getTime() / 1000);



      // run algorithm here
      var matched = 0;
      var potentialMatches = new Array();
      const requests = data["requests"];
      console.log(currMaxId)
      console.log(currMaxMatchId)
      console.log("request: "+JSON.stringify(requests))
      console.log("leng: "+requests.length);
      for (let i = 0; i < requests.length; i++) {
        console.log(i)
        console.log(requests[i]);
      }


      // for every request
      for (let i = 0; i < requests.length; i++) {
        const currentRequest = requests[i];

        // if the current request is not matched
        
        if (currentRequest!=null&& currentRequest.status != "Matched") {
          //console.log(currentRequest);

          // if its a valid request
          if (
            locationTo == currentRequest.locationTo &&
            locationFrom == currentRequest.locationFrom
          ) {
            // if(i==2) {
            //   console.log(currentRequest.requestTimeStart)
            //   console.log(currentRequest.requestTimeEnd)
            // }

            //if locationTo and locationFrom == that of the request, then check if times intersect
            //A: start date 1
            //B: End date 1
            //C: start date 2
            //D: end date 2
            //(min(B, D) - max(A, C)) >= 0

            //console.log(dateStartGMT)
            var intersection =
              Math.min(currentRequest.requestTimeEnd, dateEndGMT) -
              Math.max(currentRequest.requestTimeStart, dateStartGMT);
            //console.log(currentRequest.requestTimeEnd-currentRequest.requestTimeStart)
            if (intersection > 0 && currentRequest.email != email) {
              if (potentialMatches.length != 2) {
                //potentialMatches is an array of arrays, where each array holds a request, the intersection time, and the index of the request
                potentialMatches.push([currentRequest, intersection, i]);
              } else {
                var smallestValue = potentialMatches[0][1];
                var smallestIndex = 0;
                for (let i = 0; i < 2; i++) {
                  if (smallestValue > potentialMatches[i][1]) {
                    smallestValue = potentialMatches[i][1];
                    smallestIndex = i;
                  }
                }
                if (smallestValue < intersection) {
                  potentialMatches[smallestIndex] = [
                    currentRequest,
                    intersection,
                    i,
                  ];
                }
              }
            }
          }
        }
      }
      console.log(potentialMatches);
      if (potentialMatches.length != 0) {
        var additionalRider;
        if (potentialMatches.length == 1) {
          additionalRider = "";
        } else {
          additionalRider = potentialMatches[1][0].email;
        }

        let requests_ids = [currMaxId, potentialMatches[0][2]]; 
        
        //add new request
        set(ref(db, "requests/" + currMaxId), {
          email: "johnsmith@gmail.com",
          locationFrom: locationFrom,
          locationTo: locationTo,
          numRiders: 1,
          status: "Matched",
          requestTimeEnd: dateEndGMT,
          requestTimeStart: dateStartGMT,
          match_id: currMaxMatchId
        });
        //adjust old requests to matched
        set(ref(db, "requests/" + potentialMatches[0][2]), {
          email: potentialMatches[0][0].email,
          locationFrom: potentialMatches[0][0].locationFrom,
          locationTo: potentialMatches[0][0].locationTo,
          numRiders: 1,
          status: "Matched",
          requestTimeEnd: potentialMatches[0][0].requestTimeEnd,
          requestTimeStart: potentialMatches[0][0].requestTimeStart,
          match_id: currMaxMatchId
        });
        if (potentialMatches.length == 2) {
          requests_ids.push(potentialMatches[1][2]);
          set(ref(db, "requests/" + potentialMatches[1][2]), {
            email: potentialMatches[1][0].email,
            locationFrom: potentialMatches[1][0].locationFrom,
            locationTo: potentialMatches[1][0].locationTo,
            numRiders: 1,
            status: "Matched",
            requestTimeEnd: potentialMatches[1][0].requestTimeEnd,
            requestTimeStart: potentialMatches[1][0].requestTimeStart,
            match_id: currMaxMatchId
          });
        }

        console.log("Requests IDs are ",requests_ids);
        
        //set matches
        set(ref(db, "matches/" + currMaxMatchId), {
          locationFrom: locationFrom,
          locationTo: locationTo,
          rider1: "johnsmith@gmail.com",
          rider2: potentialMatches[0][0].email,
          rider3: additionalRider,
          //just returns the last requesters timeStart and timeEnd
          timeEnd: dateEndGMT,
          timeStart: dateStartGMT,
          request_ids: requests_ids
        });
      } else {
        set(ref(db, "requests/" + currMaxId), {
          email: "johnsmith@gmail.com",
          locationFrom: locationFrom,
          locationTo: locationTo,
          numRiders: 1,
          status: "Pending",
          requestTimeEnd: dateEndGMT,
          requestTimeStart: dateStartGMT,
          match_id: ""
        });
      }

      setLocationFrom("");
      setLocationTo("");
      setDateStart("");
      setTimeStart("");
      setDateEnd("");
      setTimeEnd("");
      setError("");
      // push new matches and request to Firebase
    }
  }

  return (
    <Row style={{ margin: "50px 0px 50px 0px" }}>
      <Col md={6} xs={12}>
        <h1>Request a New Match</h1>
        <h5>
          Need a ride? Fill out the form below to connect with a fellow student
          heading your way!
        </h5>
      </Col>

      <Col md={6} xs={12}>
        <Form onSubmit={runAlgorithm}>
          <Row className="mb-3">
            <Form.Group as={Col} md={6} controlId="validationCustom01">
              <Form.Label>Pickup Location</Form.Label>

              <Form.Control
                as="select"
                value={locationFrom}
                onChange={(e) => setLocationFrom(e.target.value)}
                required
                placeholder="Location From"
              >
                <option value="">Choose...</option>
                <option value="Allison">Allison</option>
                <option value="Tech">Tech</option>
                <option value="Lincoln">Lincoln</option>
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                Please provide a valid pickup location
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="6" controlId="validationCustom02">
              <Form.Label>Dropoff Location</Form.Label>
              <Form.Control
                as="select"
                value={locationTo}
                onChange={(e) => setLocationTo(e.target.value)}
                required
                placeholder="Location To"
              >
                <option value="">Choose...</option>
                <option value="Trader joes">Trader joes</option>
                <option value="Midway">Midway</option>
                <option value="Ohare">Ohare</option>
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                Please provide a valid dropoff location
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} md="6" controlId="validationCustom03">
              <Form.Label>Earliest pickup date</Form.Label>
              <Form.Control
                value={dateStart}
                onChange={(e) => setDateStart(e.target.value)}
                type="date"
                placeholder="City"
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid date.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="6" controlId="validationCustom04">
              <Form.Label>Earliest pickup time</Form.Label>
              <Form.Control
                value={timeStart}
                onChange={(e) => setTimeStart(e.target.value)}
                type="time"
                placeholder="State"
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid time.
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} md="6" controlId="validationCustom03">
              <Form.Label>Latest pickup date</Form.Label>
              <Form.Control
                value={dateEnd}
                onChange={(e) => setDateEnd(e.target.value)}
                type="date"
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid date
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="6" controlId="validationCustom04">
              <Form.Label>Latest pickup time</Form.Label>
              <Form.Control
                value={timeEnd}
                onChange={(e) => setTimeEnd(e.target.value)}
                type="time"
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid time.
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row>
            <p style = {{color:"red"}}>{error}</p>
          </Row>

          <Button type="submit">Submit form</Button>
        </Form>
      </Col>
    </Row>
  );
};

export default RideForm;


