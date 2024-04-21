import React from "react";
import { useState } from "react";
import Card from "react-bootstrap/Card";
import { Button } from "react-bootstrap";
import {db} from "../../utilities/FireBase";
import { ref, remove } from "firebase/database";

const RequestCard = ({ request }) => {
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

  const handleDelete = () => {
    
    // remove the match associated with the request from db
    console.log("deleting match", matchId);
    remove(ref(db, 'matches/' + matchId));
    
    // TODO go into match and adjust associated requests

    // remove the requests from db
    console.log("deleting request", requestId);
    remove(ref(db, 'requests/' + requestId));
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
