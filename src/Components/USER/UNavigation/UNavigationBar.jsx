import React from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useState } from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import ListGroup from "react-bootstrap/ListGroup";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./U-Navigation-Bar.css";
import ProfileImage from "../../../assets/Profile.png";

// ********************************************************************
// ********************************************************************
// ********************************************************************
// *********************** SECTION BREAK ******************************
// ********************************************************************
// ********************************************************************
// ********************************************************************

const UNavigationBar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary sticky-top">
      <Container fluid>
        <Navbar.Brand href="#">URLScanner</Navbar.Brand>

        <Navbar.Toggle aria-controls="navbarScroll" />

        <Navbar.Collapse id="navbarScroll" className="justify-content-between">
          {/* Left-side nav links (collapse on small screens) */}
          <Nav className="d-flex gap-3">
            <Nav.Link 
              as={Link} 
              to="/UDash"
              className={isActive('/UDash') ? 'active' : ''}
              style={{
                color: isActive('/UDash') ? '#1a00ff' : 'inherit',
                fontWeight: isActive('/UDash') ? 'bold' : 'normal'
              }}
            >
              <i className="fa-solid fa-house"></i> Dashboard
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/UAnalysis"
              className={isActive('/UAnalysis') ? 'active' : ''}
              style={{
                color: isActive('/UAnalysis') ? '#1a00ff' : 'inherit',
                fontWeight: isActive('/UAnalysis') ? 'bold' : 'normal'
              }}
            >
              <i className="fa-solid fa-magnifying-glass-chart"></i> Analysis
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/UHistory"
              className={isActive('/UHistory') ? 'active' : ''}
              style={{
                color: isActive('/UHistory') ? '#1a00ff' : 'inherit',
                fontWeight: isActive('/UHistory') ? 'bold' : 'normal'
              }}
            >
              <i className="fa fa-history"></i> History
            </Nav.Link>
          </Nav>

          {/* Right-side (profile & logout) */}
          <Nav className="d-flex gap-4">
            <Nav.Link href="#profile">
              <img
                src={ProfileImage}
                alt="Profile"
                style={{ width: "32px", height: "32px", borderRadius: "50%" }}
              />
            </Nav.Link>
            <Nav.Link as={Link} to="/ULoginReg">
              <i className="fa-solid fa-lock"></i> LogOut
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default UNavigationBar;
