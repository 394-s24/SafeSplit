import React from "react";
import { useState } from 'react';
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Card from "react-bootstrap/Card";
import MatchCard from "../MatchCard/MatchCard";
import ReactDatePicker from "react-datepicker";
import "./DataLogger.css";
import RequestCard from "../RequestCard/RequestCard";

const DataLogger = ({ matchData, reqData, tabKey, setTabKey}) => {

  return (
    <div id="DataLogger">
      {" "}
      <Tabs
        activeKey={tabKey}
        onSelect={(k) => setTabKey(k)}
        id="uncontrolled-tab-example"
        className="mb-3"
      >
        <Tab eventKey="request" title="Request" className="data-card-holder">
          <div className="data-card-holder">
            {reqData.map((request) => (
              <RequestCard key={ request.timeStart} request={request} />
            ))}
          </div>
        </Tab>
        <Tab eventKey="matches" title="Matches">
          <div className="data-card-holder">
            {matchData.map((match) => (
              <MatchCard key={ match.timeStart} match={match} />
            ))}
          </div>
        </Tab>
      </Tabs>{" "}
    </div>
  );
};

export default DataLogger;
