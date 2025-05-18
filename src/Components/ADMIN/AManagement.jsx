import React, { useState } from "react";
import ANavigationBar from "../ADMIN/ANavigation/ANavigationBar";
import { Table, Button, Modal, Form, Card, Pagination } from "react-bootstrap";

const AManagement = () => {
  const [users, setUsers] = useState([
    {
      user_name: "testAdmin",
      email: "testAdmin@gmail.com",
      role: "user",
      created_at: "2025-05-18T05:37:03.443000",
    },
    {
      user_name: "janeDoe",
      email: "jane@example.com",
      role: "user",
      created_at: "2025-04-01T12:00:00.000Z",
    },
    {
      user_name: "johnDoe",
      email: "john@example.com",
      role: "admin",
      created_at: "2025-03-15T10:00:00.000Z",
    },
    {
      user_name: "alice",
      email: "alice@example.com",
      role: "user",
      created_at: "2025-02-10T08:00:00.000Z",
    },
    {
      user_name: "bob",
      email: "bob@example.com",
      role: "user",
      created_at: "2025-01-20T09:30:00.000Z",
    },
    // Add more for demo if needed
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedPassword, setUpdatedPassword] = useState("");

  // Pagination setup
  const itemsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);

  const paginatedUsers = users.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const renderPagination = () => {
    const totalPages = Math.ceil(users.length / itemsPerPage);
    return (
      <Pagination>
        {[...Array(totalPages)].map((_, idx) => (
          <Pagination.Item
            key={idx}
            active={idx + 1 === currentPage}
            onClick={() => setCurrentPage(idx + 1)}
          >
            {idx + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    );
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
              {paginatedUsers.map((user, idx) => (
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
                        setUpdatedPassword("");
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
          {renderPagination()}
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
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={updatedName}
                onChange={(e) => setUpdatedName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formPassword" className="mt-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Leave blank to keep unchanged"
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
          <Button
            variant="success"
            onClick={() => {
              setUsers((prev) =>
                prev.map((u) =>
                  u.email === editUser.email
                    ? { ...u, user_name: updatedName }
                    : u
                )
              );
              setShowModal(false);
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AManagement;
