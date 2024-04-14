import React from "react";
import Card from "react-bootstrap/Card";

const MatchCard = ({ match }) => {
    const timeStart = match[0]
    const timeEnd = match[1]
    const locationFrom = match[2]
    const locationTo = match[3]
    const riders = match[4]

  return (
    <Card className="dataCard">
      <Card.Body>
        <Card.Title>Match</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          {riders.map((rider) => (
            <span>
              {" "}
              <a href={"mailto:" + { rider }}>{rider}</a> <br></br>
            </span>
          ))}
        </Card.Subtitle>
        <Card.Title>From: {locationFrom}</Card.Title>
        <Card.Title>To: {locationTo}</Card.Title>
        <Card.Text>
          Time: {timeStart} - {timeEnd}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default MatchCard;