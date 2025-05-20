import React from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { Outlet, Link } from "react-router-dom";
import { useState } from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import ListGroup from "react-bootstrap/ListGroup";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./A-Navigation-Bar.css";
import ProfileImage from "../../../assets/Profile.png";

// ********************************************************************
// ********************************************************************
// ********************************************************************
// *********************** SECTION BREAK ******************************
// ********************************************************************
// ********************************************************************
// ********************************************************************


const ANavigationBar = () => {
   
//   const [show, setShow] = useState(false);
//   const handleClose = () => setShow(false);
//   const handleShow = () => setShow(true);

  return (
    // <Navbar expand="lg" className="bg-body-tertiary d-flex gap-4 sticky-top">
    //   <Container fluid>

    //     <div className="d-flex align-items-center gap-3">
    //       <Button variant="primary" onClick={handleShow}>
    //         <i className="fa fa-bars"></i>
    //       </Button>

    //       <Navbar.Brand href="#">Admin's Panel</Navbar.Brand>
    //     </div>

    //     <Offcanvas show={show} onHide={handleClose}>
    //       <Offcanvas.Header closeButton>
    //         <Offcanvas.Title>Prototype-1</Offcanvas.Title>
    //       </Offcanvas.Header>
    //       <Offcanvas.Body>
    //         <ListGroup as="ul">
    //           <ListGroup.Item as="li" className="border-0">
    //             <Link to="/AdminDash">
    //               <i className="fa-solid fa-house"></i> Dashboard
    //             </Link>
    //           </ListGroup.Item>
    //           <ListGroup.Item as="li" className="border-0">
    //             <Link to="/Analysis">
    //               <i className="fa-solid fa-magnifying-glass-chart"></i>{" "}
    //               Analysis
    //             </Link>
    //           </ListGroup.Item>
    //           <ListGroup.Item as="li" className="border-0">
    //             <Link to="/UserManagement">
    //               <i className="fa fa-user"></i> User Management
    //             </Link>
    //           </ListGroup.Item>
    //         </ListGroup>
    //       </Offcanvas.Body>
    //     </Offcanvas>

    //     <Navbar.Toggle aria-controls="navbarScroll" />
    //     <Navbar.Collapse id="navbarScroll">
    //       <Nav
    //         className="ms-auto  my-2 my-lg-0 d-flex gap-4"
    //         style={{ maxHeight: "100px" }}
    //         navbarScroll
    //       >
    //         <Nav.Link href="#action1">
    //           <img
    //             src={ProfileImage}
    //             alt="Profile"
    //             style={{ width: "32px", height: "32px", borderRadius: "50%" }}
    //           />
    //         </Nav.Link>
    //         <Nav.Link as={Link} to="/LoginRegister">
    //           {" "}
    //           <i className="fa-solid fa-lock"></i> LogOut{" "}
    //         </Nav.Link>
    //       </Nav>
    //     </Navbar.Collapse>
    //   </Container>
    // </Navbar>
   <Navbar expand="lg" className="bg-body-tertiary sticky-top">
  <Container fluid>
    <Navbar.Brand href="#">URLScanner</Navbar.Brand>

    <Navbar.Toggle aria-controls="navbarScroll" />

    <Navbar.Collapse id="navbarScroll" className="justify-content-between">
      {/* Left-side nav links (collapse on small screens) */}
      <Nav className="d-flex gap-3">
        <Nav.Link as={Link} to="/ADash">
          <i className="fa-solid fa-house"></i> Dashboard
        </Nav.Link>
        <Nav.Link as={Link} to="/AAnalysis">
          <i className="fa-solid fa-magnifying-glass-chart"></i> Analysis
        </Nav.Link>
        <Nav.Link as={Link} to="/AManagement">
          <i className="fa fa-user"></i> User Management
        </Nav.Link>
        <Nav.Link as={Link} to="/ASubmissionReview">
          <i className="fa fa-user"></i> Submission Review
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
        <Nav.Link as={Link} to="/LoginReg">
          <i className="fa-solid fa-lock"></i> LogOut
        </Nav.Link>
      </Nav>
    </Navbar.Collapse>
  </Container>
</Navbar>


  )
}

export default ANavigationBar