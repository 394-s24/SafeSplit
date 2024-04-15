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
        </Tab>
      </Tabs>{" "}
    </div>
  );
};

export default DataLogger;
