import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/students/";

function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    course: "",
  });
  const [editingId, setEditingId] = useState(null);

  const fetchStudents = async () => {
    const response = await axios.get(API_URL);
    setStudents(response.data);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const resetForm = () => {
    setFormData({ name: "", email: "", course: "" });
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (editingId) {
      await axios.put(`${API_URL}${editingId}/`, formData);
    } else {
      await axios.post(API_URL, formData);
    }

    resetForm();
    fetchStudents();
  };

  const handleEdit = (student) => {
    setFormData({
      name: student.name,
      email: student.email,
      course: student.course,
    });
    setEditingId(student.id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}${id}/`);
    if (editingId === id) {
      resetForm();
    }
    fetchStudents();
  };

  return (
    <div style={{ maxWidth: "900px", margin: "20px auto", fontFamily: "Arial, sans-serif" }}>
      <h1>Student Record Management System</h1>

      <h2>Student Form</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <div style={{ marginBottom: "10px" }}>
          <label>
            Name:{" "}
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>
            Email:{" "}
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>
            Course:{" "}
            <input
              type="text"
              name="course"
              value={formData.course}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <button type="submit">
          {editingId ? "Update Student" : "Add Student"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={resetForm}
            style={{ marginLeft: "10px" }}
          >
            Cancel Edit
          </button>
        )}
      </form>

      <h2>Students List</h2>
      <table border="1" cellPadding="8" cellSpacing="0" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Course</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.id}</td>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>{student.course}</td>
              <td>
                <button onClick={() => handleEdit(student)}>Edit</button>
                <button
                  onClick={() => handleDelete(student.id)}
                  style={{ marginLeft: "8px" }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {students.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No students found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
