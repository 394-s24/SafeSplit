import React from "react";
import { useState } from "react";
import Card from "react-bootstrap/Card";
import { Button } from "react-bootstrap";
import {db} from "../../utilities/FireBase";
import { ref, remove,update } from "firebase/database";

const RequestCard = ({ request,data}) => {
  const startTime = request[0];
  const endTime = request[1];
  const locationFrom = request[2];
  const locationTo = request[3];
  const userEmail = request[4];
  const numRiders = request[5];
  const status = request[6];
  const requestId = request[7];
  const matchId = request[8];

  const [editing, setEditing] = useState(false);

 // console.log(matchId) 

  //object requests 
  const requests=data["requests"]

 

  const handleDelete = () => {
    //when request is pending , just remove the request

    //firebase remove set ref location's value to null!
    if(status==="Pending"){
      console.log("deleting request", requestId);
      remove(ref(db, 'requests/' + requestId));

    }
    //when request is matched, remove the request and match, then reset request within the match
    else{
    // remove the match associated with the request from db
    console.log("deleting match", matchId);
    remove(ref(db, 'matches/' + matchId));
    console.log("deleting request", requestId);
    remove(ref(db, 'requests/' + requestId));
    //  go into match and adjust associated requests
      for (const key in requests){
        console.log( requests[key]['match_id'])
        //console.log(requests[key]['match_id']==matchId)
        //find request with same match_id , set match_id to '' ,status to 'pending'
        if(requests[key]['match_id']==matchId&&key!=requestId){
          console.log("set key  "+key+" to Pending and empty matchid")
          //muti-line update: https://firebase.blog/posts/2015/09/introducing-multi-location-updates-and_86
          update(ref(db, "requests/" + key),{
            status: "Pending",
            match_id:""
          })
        }
      }
    }
  }


  return (
    <Card className="dataCard">
      <Card.Body>
        <Card.Title>Request</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{userEmail}</Card.Subtitle>
        <Card.Subtitle className="mb-2 text-muted">
          Riders: {numRiders}
        </Card.Subtitle>
        <Card.Title>From: {locationFrom}</Card.Title>
        <Card.Title>To: {locationTo}</Card.Title>
        <Card.Text>
          Time: {startTime} - {endTime}
        </Card.Text>
        <Card.Subtitle className="mb-2 text-muted">
          Status: {status}
        </Card.Subtitle>

        <Button variant="danger" onClick={handleDelete}>Delete</Button>

      </Card.Body>
    </Card>
  );
};

export default RequestCard;
