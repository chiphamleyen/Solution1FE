import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Card } from "react-bootstrap";
import axios from "axios";
import ANavigationBar from "../ADMIN/ANavigation/ANavigationBar"; // Assuming this exists

const AManagement = () => {
  const [users, setUsers] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedPassword, setUpdatedPassword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      window.location.href = "/";
      return;
    }

    // Fetch users
    axios
      .get(
        `https://urlclassifier-g5eub3ggf8gkf2fz.australiaeast-01.azurewebsites.net/api/user_management/list_users?page=${currentPage}&size=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      )
      .then((response) => {
        setUsers(response.data.items);
        setTotalPages(Math.ceil(response.data.total / 10));
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, [currentPage]);

  const handleDecision = (id, decision) => {
    setSubmissions((prev) =>
      prev.map((entry) =>
        entry.id === id ? { ...entry, status: decision } : entry
      )
    );
  };

  const handleSaveChanges = async () => {
    if (!editUser || !updatedName || !updatedPassword) {
      alert("Both fields are required.");
      return;
    }

    const updatedUser = {
      ...editUser,
      user_name: updatedName,
      email: updatedPassword,
    };

    const token = localStorage.getItem("admin_token");
    const userId = editUser._id;

    try {
      const response = await axios.put(
        `https://urlclassifier-g5eub3ggf8gkf2fz.australiaeast-01.azurewebsites.net/api/user_management/${userId}`,
        {
          user_name: updatedUser.user_name,
          email: updatedUser.email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? updatedUser : u))
      );
      setShowModal(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error updating user:", error.response || error);
      setShowErrorModal(true);
    }
  };

  return (
    <div className="commonStyle">
      <ANavigationBar />

      {/* USER MANAGEMENT */}
      <Card className="m-4">
        <Card.Body>
          <Card.Title>User Management</Card.Title>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr key={idx}>
                  <td>{user.user_name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{new Date(user.created_at).toLocaleDateString()}</td>
                  <td>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        setEditUser(user);
                        setUpdatedName(user.user_name);
                        setUpdatedPassword(user.email);
                        setShowModal(true);
                      }}
                    >
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="pagination-controls d-flex justify-content-between align-items-center mt-3">
            <Button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              Previous
            </Button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <Button
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
            >
              Next
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Modal for user edit */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formUsername">
              <Form.Label>New Username</Form.Label>
              <Form.Control
                type="text"
                value={updatedName}
                onChange={(e) => setUpdatedName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formEmail" className="mt-3">
              <Form.Label>New Email</Form.Label>
              <Form.Control
                type="email"
                value={updatedPassword}
                onChange={(e) => setUpdatedPassword(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Success Modal */}
      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Success!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>User updated successfully.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSuccessModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Error Modal */}
      <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Error!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>There was an error updating the user. Please try again later.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowErrorModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AManagement;
