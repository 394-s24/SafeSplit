import React from 'react'
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Navigation from './Navigation';
import {useAuthState} from '../../utilities/FireBase';
import { useState } from 'react';
import { useEffect } from 'react';

const NavBar = ({ user, setUser }) => {
  
  const [authState] =  useAuthState();
  
  useEffect(() => {
    authState != null ? setUser(() => authState.email) : setUser(null);
  }, [authState]);
  
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="#home">
          <img
            src="https://stephaniema-agile.s3.us-east-2.amazonaws.com/safesplit_logo.svg"
            width="170"
            height="38"
            className="d-inline-block align-top"
            alt="SafeSplit logo"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse className="justify-content-end">
          <Nav>
            <Navbar.Text>
              Signed in as: {user === null ? "" : user}
            </Navbar.Text>
            <Navigation />
            

          
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default NavBar



{/* <NavDropdown title="Select User" id="basic-nav-dropdown" onSelect={function (evt) { setUser(evt) }}>
              <NavDropdown.Item eventKey="johnsmith@gmail.com">johnsmith@gmail.com</NavDropdown.Item>
              <NavDropdown.Item eventKey="gracehopper@gmail.com">gracehopper@gmail.com</NavDropdown.Item>
              <NavDropdown.Item eventKey="janedoe@gmail.com">janedoe@gmail.com</NavDropdown.Item>

            </NavDropdown> */}