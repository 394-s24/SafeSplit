import React, { useState } from "react";
import { db } from "../../utilities/FireBase";
import { ref, onValue, set } from "firebase/database";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import "./RideForm.css";
import { useToast } from '@chakra-ui/react'



const RideForm = ({ currMaxId, currMaxMatchId, data, tabKey, setTabKey, user}) => {
  const [locationFrom, setLocationFrom] = useState("");
  const [locationTo, setLocationTo] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [timeStart, setTimeStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [timeEnd, setTimeEnd] = useState("");
  const [error, setError] = useState("");


  const dbRef = ref(db);
  const toast = useToast()
  

  function firebaseTest(event) {
    event.preventDefault(); // prevent refresh

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
    if (new Date(dateStart + " " + timeStart) < new Date() || new Date(dateEnd + " " + timeEnd) < new Date()) {
      setError("Please select a future date");
      return;
    }
    else if (dateStart > dateEnd) {
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
      var matched = false;

      const dateStartGMT = Math.floor(algorithmStartDate.getTime() / 1000);
      const dateEndGMT = Math.floor(algorithmEndDate.getTime() / 1000);

      // run algorithm here
      var matched = 0;
      var potentialMatches = new Array();

      var matches = data["matches"];
      matches = Array(matches);
      matches.forEach((currentMatch) => {
        // correct for weird firebase formatting 
        currentMatch = Object.values(currentMatch)[0];

        if (currentMatch.request_ids.length < 3) {
          if (currentMatch.rider1 != user || currentMatch.rider2 != user) {
            //if the user is not in the match, then check if the user's request intersects with the match
            var intersection =
              Math.min(currentMatch.timeEnd, dateEndGMT) -
              Math.max(currentMatch.timeStart, dateStartGMT);
            if (intersection > 0) {
              potentialMatches.push([intersection, currentMatch]);
            }
          }
        }
      });

      if (potentialMatches.length != 0) {
        // sort potential matches by intersection time
        potentialMatches.sort((a, b) => b[0] - a[0]);
        
        var targetMatch = potentialMatches[0][1];
        //modify match
        set(ref(db, "matches/" + targetMatch.id), {
          locationFrom: locationFrom,
          locationTo: locationTo,
          rider1: targetMatch.rider1,
          rider2: targetMatch.rider2,
          rider3: user,
          //just returns the last requesters timeStart and timeEnd
          timeEnd: Math.min(targetMatch.timeEnd, dateEndGMT),
          timeStart: Math.max(targetMatch.timeStart, dateStartGMT),
          request_ids: targetMatch.request_ids.concat(currMaxId),
          id: targetMatch.id
        });

        matched = true;
      } else {
        // else if couldn't find existing match to add to
        var requests = data["requests"];


        // for every request
        requests = Array(requests)[0];
        requests.forEach((currentRequest) => {
          // for (let i = 0; i < requests.length; i++) {
          //   const currentRequest = requests[i];

          // if the current request is not matched
          currentRequest = Object.values(currentRequest);

          if (currentRequest[8] != "Matched") {

            // if request locations match
            if (
              locationTo == currentRequest[3] &&
              locationFrom == currentRequest[2]
            ) {

              var intersection =
                Math.min(currentRequest[6], dateEndGMT) -
                Math.max(currentRequest[7], dateStartGMT);
              if (intersection > 0 && currentRequest[0] != user) {
                potentialMatches.push([intersection, currentRequest]);
              }
            }
          }
        });

        if (potentialMatches.length > 0) {
          // sort potential matches by intersection time
          potentialMatches.sort((a, b) => b[0] - a[0]);

          var targetRequest = potentialMatches[0];
          targetRequest = {
            email: targetRequest[1][0],
            locationFrom: targetRequest[1][2],
            locationTo: targetRequest[1][3],
            requestTimeEnd: targetRequest[1][6],
            requestTimeStart: targetRequest[1][7],
            id: targetRequest[1][1],
            numRiders: targetRequest[5],
            match_id: targetRequest[1][4]
          }
          //adjust target request to matched
          set(ref(db, "requests/" + targetRequest.id), {
            email: targetRequest.email,
            locationFrom: targetRequest.locationFrom,
            locationTo: targetRequest.locationTo,
            numRiders: 2,
            status: "Matched",
            requestTimeEnd: targetRequest.requestTimeEnd,
            requestTimeStart: targetRequest.requestTimeStart,
            match_id: currMaxMatchId,
            id: targetRequest.id
          });

          // add new match
          set(ref(db, "matches/" + currMaxMatchId), {
            locationFrom: locationFrom,
            locationTo: locationTo,
            rider1: targetRequest.email,
            rider2: user,
            rider3: "",
            //just returns the last requesters timeStart and timeEnd
            timeEnd: Math.min(targetRequest.requestTimeEnd, dateEndGMT),
            timeStart: Math.max(targetRequest.requestTimeStart, dateStartGMT),
            request_ids: [targetRequest.id, currMaxId],
            id: currMaxMatchId
          });

          matched = true;
        }
      }

      

      // in either case, add new request
      set(ref(db, "requests/" + currMaxId), {
        email: user,
        locationFrom: locationFrom,
        locationTo: locationTo,
        numRiders: 1,
        status: matched ? "Matched" : "Pending",
        requestTimeEnd: dateEndGMT,
        requestTimeStart: dateStartGMT,
        match_id: currMaxMatchId,
        id: currMaxId
      });

      toast({
        position: "top", 
        title: "Request Submitted",
        description: "Request successfully submitted",
        status: "success",
        duration: 9000,
        isClosable: true,
      })

      if (matched) {
        // switch to match tab and add match success toast
        setTabKey("matches")
        setTimeout(() => {
          toast({
            position: "top", 
            title: "New Match",
            description: "Your request has been matched!",
            status: "success",
            duration: 9000,
            isClosable: true,
          })
        }, 1000);
      }

      // if (!matched) {
      //   throw new Error("didn't match");
      // }

      // clear everything
      setLocationFrom("");
      setLocationTo("");
      setDateStart("");
      setTimeStart("");
      setDateEnd("");
      setTimeEnd("");
      setError("");

      
    
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
                <option value="OHare">OHare</option>
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


