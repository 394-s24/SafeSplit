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
        <Tab eventKey="request" title="Request" class="data-card-holder">
          <div class="data-card-holder">
            {reqData.map((request) => (
              <RequestCard request={request} />
            ))}
          </div>
        </Tab>
        <Tab eventKey="matches" title="Matches">
          <div class="data-card-holder">
            {matchData.map((match) => (
              <MatchCard match={match} />
            ))}
          </div>
        </Tab>
      </Tabs>{" "}
    </div>
  );
};

export default DataLogger;
