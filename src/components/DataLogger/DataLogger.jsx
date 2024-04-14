import React from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Card from "react-bootstrap/Card";
import MatchCard from "../MatchCard/MatchCard";
import ReactDatePicker from "react-datepicker";
import "./DataLogger.css";
import RequestCard from "../RequestCard/RequestCard";

const DataLogger = ({ matchData, reqData }) => {
  return (
    <div id="DataLogger">
      {" "}
      <Tabs
        defaultActiveKey="request"
        id="uncontrolled-tab-example"
        className="mb-3"
      >
        <Tab eventKey="request" title="Request">
          {reqData.map((request) => (
            <RequestCard request={request} />
          ))}
        </Tab>
        <Tab eventKey="matches" title="Matches">
          {matchData.map((match) => (
            <MatchCard match={match} />
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
      </Tabs>{" "}
    </div>
  );
};

export default DataLogger;
