import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Card } from "react-bootstrap";
import axios from "axios";
import ANavigationBar from "../ADMIN/ANavigation/ANavigationBar"; // Assuming this exists

const AManagement = () => {
  const [users, setUsers] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showCreateAdminModal, setShowCreateAdminModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedPassword, setUpdatedPassword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  
  // New admin creation states
  const [newAdmin, setNewAdmin] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [createAdminError, setCreateAdminError] = useState("");

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

  const handleCreateAdmin = async () => {
    if (!newAdmin.username || !newAdmin.email || !newAdmin.password) {
      setCreateAdminError("All fields are required");
      return;
    }

    const token = localStorage.getItem("admin_token");
    try {
      const response = await axios.post(
        "https://urlclassifier-g5eub3ggf8gkf2fz.australiaeast-01.azurewebsites.net/api/user_management/create_admin",
        {
          user_name: newAdmin.username,
          email: newAdmin.email,
          password: newAdmin.password
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      // Reset form and show success
      setNewAdmin({ username: "", email: "", password: "" });
      setShowCreateAdminModal(false);
      setShowSuccessModal(true);
      
      // Refresh user list
      fetchUsers();
    } catch (error) {
      console.error("Error creating admin:", error);
      setCreateAdminError(error.response?.data?.message || "Failed to create admin");
    }
  };

  const fetchUsers = () => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      window.location.href = "/";
      return;
    }

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
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  return (
    <div className="commonStyle">
      <ANavigationBar />

      {/* USER MANAGEMENT */}
      <Card className="m-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Card.Title className="mb-0">User Management</Card.Title>
            <Button 
              variant="success" 
              onClick={() => setShowCreateAdminModal(true)}
            >
              <i className="fa fa-plus me-2"></i>Create New Admin
            </Button>
          </div>
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

      {/* Create Admin Modal */}
      <Modal show={showCreateAdminModal} onHide={() => setShowCreateAdminModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create New Admin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3 d-flex align-items-center">
              <Form.Label className="mb-0 me-3" style={{ minWidth: "100px" }}>Username</Form.Label>
              <Form.Control
                type="text"
                value={newAdmin.username}
                onChange={(e) => setNewAdmin({...newAdmin, username: e.target.value})}
                placeholder="Enter username"
              />
            </Form.Group>
            <Form.Group className="mb-3 d-flex align-items-center">
              <Form.Label className="mb-0 me-3" style={{ minWidth: "100px" }}>Email</Form.Label>
              <Form.Control
                type="email"
                value={newAdmin.email}
                onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                placeholder="Enter email"
              />
            </Form.Group>
            <Form.Group className="mb-3 d-flex align-items-center">
              <Form.Label className="mb-0 me-3" style={{ minWidth: "100px" }}>Password</Form.Label>
              <Form.Control
                type="password"
                value={newAdmin.password}
                onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})}
                placeholder="Enter password"
              />
            </Form.Group>
            {createAdminError && (
              <div className="text-danger mb-3">{createAdminError}</div>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => {
            setShowCreateAdminModal(false);
            setCreateAdminError("");
            setNewAdmin({ username: "", email: "", password: "" });
          }}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleCreateAdmin}>
            Create Admin
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
