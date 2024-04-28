import React from "react";
import Card from "react-bootstrap/Card";
import { Button} from "react-bootstrap";
import { ref, remove,update } from "firebase/database";
import {db} from "../../utilities/FireBase";
import "./MatchCard.css";

const MatchCard = ({ match, data}) => {
    const timeStart = match[0]
    const timeEnd = match[1]
    const locationFrom = match[2]
    const locationTo = match[3]
    const riders = match[4]
    const match_id=match[5]

    const requests=data["requests"]

    const handleDelete = () => {
      // remove the match associated with the request from db
      console.log("deleting match", match_id);
      remove(ref(db, 'matches/' + match_id));
  
      for (const key in requests){
        //find request with same match_id , set match_id to '' ,status to 'pending'
        if(requests[key]['match_id']==match_id){
          console.log("set request "+key+" to Pending and empty matchid")
          //muti-line update: https://firebase.blog/posts/2015/09/introducing-multi-location-updates-and_86
          update(ref(db, "requests/" + key),{
            status: "Pending",
            match_id:""
          })
        }
      }
    }

  return (
    <Card className="dataCard" id={match_id}>
      <Card.Body>
        <Card.Title>Match</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          {riders.map((rider) => (
            <span key={ rider }>
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

        <Button variant="danger" onClick={handleDelete}>Delete</Button>
      </Card.Body>
    </Card>
  );
};

export default MatchCard;