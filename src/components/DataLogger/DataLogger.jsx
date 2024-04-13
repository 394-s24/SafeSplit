import React from 'react'
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Card from "react-bootstrap/Card";
import './DataLogger.css'


const DataLogger = ({matchData, reqData}) => {
  return (
    <Tabs
        defaultActiveKey="request"
        id="uncontrolled-tab-example"
        className="mb-3"
      >
        <Tab eventKey="request" title="Request">
          {reqData.map(item => (
            <Card style={{ width: '35%' }}>
              <Card.Body>
                <Card.Title>Request #{item[7]}</Card.Title>

                <Card.Subtitle className="mb-2 text-muted">{item[4]}
                </Card.Subtitle>
                <Card.Subtitle className="mb-2 text-muted">Riders: {item[5]}
                </Card.Subtitle>
                <Card.Title>From: {item[2]}</Card.Title>
                <Card.Title>To: {item[3]}</Card.Title>
                <Card.Text>
                  Time: {item[0]} - {item[1]}
                </Card.Text>
                <Card.Subtitle className="mb-2 text-muted">Status: {item[6]}
                </Card.Subtitle>
              </Card.Body>
            </Card>
          ))}
        </Tab>
        <Tab eventKey="matches" title="Matches">
          {matchData.map(item => (
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
          ))}
          {/* <Card style={{ width: '18rem' }}>
            <Card.Body>
              <Card.Title>Match #1</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">{rider1}, {rider2}</Card.Subtitle>
              <Card.Title>From: {matchFrom}</Card.Title>
              <Card.Title>To: {matchTo}</Card.Title>
              <Card.Text>
                Time: {matchStart} <br></br> {matchEnd}
              </Card.Text>
            </Card.Body>
          </Card> */}
        </Tab>
      </Tabs>
  )
}

export default DataLogger