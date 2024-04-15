import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { db } from "../../FireBase";
import { ref, onValue, set } from "firebase/database";

import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";

import "./RideForm.css";
// import { i } from 'vitest/dist/reporters-P7C2ytIv';

const RideForm = ({ currMaxId, currMaxMatchId, data }) => {
  const [locationFrom, setLocationFrom] = useState("");
  const [locationTo, setLocationTo] = useState("");
  const [email, setEmail] = useState("");
  const [dateStart, setDateStart] = useState(new Date());
  const [dateEnd, setDateEnd] = useState(new Date());

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

    console.log("Running Algorithm");
    // console.log(dateStart.toLocaleString("en-US", {timeZone: "America/Chicago"}));
    // console.log(dateStart.toLocaleString("en-US", {timeZone: "UTC"}));
    // console.log(Math.floor(dateStart.getTime() / 1000));
    const dateStartGMT = Math.floor(dateStart.getTime() / 1000);
    const dateEndGMT = Math.floor(dateEnd.getTime() / 1000);

    // run algorithm here
    var matched = 0;
    var potentialMatches = new Array();
    const requests = data["requests"];
    for (let i = 0; i < Object.keys(requests).length; i++) {
      const currentRequest = requests[i];
      if (currentRequest.status != "Matched") {
        console.log(currentRequest);
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
      //   //set matches
      set(ref(db, "matches/" + currMaxMatchId), {
        locationFrom: locationFrom,
        locationTo: locationTo,
        rider1: "johnsmith@gmail.com",
        rider2: potentialMatches[0][0].email,
        rider3: additionalRider,
        //just returns the last requesters timeStart and timeEnd
        timeEnd: dateEndGMT,
        timeStart: dateStartGMT,
      });
      //add new request
      set(ref(db, "requests/" + currMaxId), {
        email: "johnsmith@gmail.com",
        locationFrom: locationFrom,
        locationTo: locationTo,
        numRiders: 1,
        status: "Matched",
        requestTimeEnd: dateEndGMT,
        requestTimeStart: dateStartGMT,
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
      });
      if (potentialMatches.length == 2) {
        set(ref(db, "requests/" + potentialMatches[1][2]), {
          email: potentialMatches[1][0].email,
          locationFrom: potentialMatches[1][0].locationFrom,
          locationTo: potentialMatches[1][0].locationTo,
          numRiders: 1,
          status: "Matched",
          requestTimeEnd: potentialMatches[1][0].requestTimeEnd,
          requestTimeStart: potentialMatches[1][0].requestTimeStart,
        });
      }
    } else {
      set(ref(db, "requests/" + currMaxId), {
        email: "johnsmith@gmail.com",
        locationFrom: locationFrom,
        locationTo: locationTo,
        numRiders: 1,
        status: "Pending",
        requestTimeEnd: dateEndGMT,
        requestTimeStart: dateStartGMT,
      });
    }
    setLocationTo("");
    setLocationFrom("");
    setDateStart(new Date());
    setDateEnd(new Date());
    // need to reset form to reset location fields
    document.getElementById("request-form").reset();
    // push new matches and request to Firebase
  }

  return (
    <div className="center-item">
      <div id="form-container">
        <div id="form-header-container">
          <div id="form-header">
            <h1>Request a New Match</h1>
            <h5>
              Need a ride? Fill out the form below to connect with a fellow
              student heading your way!
            </h5>
          </div>
        </div>
        <div id="form-body">
          <Form id="request-form" onSubmit={(e) => runAlgorithm(e, {})}>
            <h4 className="request-form-entry">Pickup Location</h4>
            <Form.Select
              name="pickup-location"
              className="request-form-entry"
              aria-label="Default select example"
              onChange={(e) => setLocationFrom(e.target.value)}
              required
            >
              <option>Select Pickup Location</option>
              <option value="Allison">Allison</option>
              <option value="Tech">Tech</option>
              <option value="Lincoln">Lincoln</option>
            </Form.Select>
            <h4 className="request-form-entry">Dropoff Location</h4>
            <Form.Select
              name="dropoff-location"
              className="request-form-entry"
              aria-label="Default select example"
              onChange={(e) => setLocationTo(e.target.value)}
              required
            >
              <option>Select Destination</option>
              <option value="OHare">OHare</option>
              <option value="Midway">Midway</option>
            </Form.Select>
            <h4 className="request-form-entry">Time Begin</h4>
            <div>
              <DateTimePicker
                className="request-form-entry"
                disableClock={true}
                value={dateStart}
                onChange={(dateStart) => setDateStart(dateStart)}
                required
              />
            </div>
            <h4 className="request-form-entry">Time End</h4>
            <div>
              {/* <Form.Control type ="date"></Form.Control>
              <Form.Control type ="time"></Form.Control> */}
              <DateTimePicker
                className="request-form-entry"
                disableClock={true}
                value={dateEnd}
                onChange={(dateEnd) => setDateEnd(dateEnd)}
                required
              />
            </div>
            <Button
              className="request-form-entry"
              variant="light"
              type="submit"
            >
              Place Request
            </Button>{" "}
          </Form>
        </div>
      </div>
    </div>
  );
};

export default RideForm;
