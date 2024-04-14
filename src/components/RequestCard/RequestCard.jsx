import React from "react";
import Card from "react-bootstrap/Card";

const RequestCard = ({ request }) => {
  const startTime = request[0];
  const endTime = request[1];
  const locationFrom = request[2];
  const locationTo = request[3];
  const userEmail = request[4];
  const numRiders = request[5];
  const status = request[6];

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
      </Card.Body>
    </Card>
  );
};

export default RequestCard;
