import React from 'react'
import Card from "react-bootstrap/Card";

const MatchCard = ({item}) => {
  return (
        <Card style={{ width: '35%' }}>
          <Card.Body>
            <Card.Title>Match #{ item[5]}</Card.Title>

            <Card.Subtitle className="mb-2 text-muted">{item[4].map(rider => (<span> <a href={"mailto:" + {rider}}>{rider}</a> <br></br></span>))}
            </Card.Subtitle>
            <Card.Title>From: {item[2]}</Card.Title>
            <Card.Title>To: {item[3]}</Card.Title>
            <Card.Text>
              Time: {item[0]} - {item[1]}
            </Card.Text>
          </Card.Body>
        </Card>
  )
}

export default MatchCard