import React, { useState, useEffect } from "react";
import { auth } from "../auth/firebase";
import "../styles/SuperAdmin.css";

function SuperAdminDashboard({ user }) {

  const [districts, setDistricts] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [district, setDistrict] = useState("");
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    fetch("/data/District.json")
      .then((res) => res.json())
      .then((data) => {
        if (data.districts && Array.isArray(data.districts)) {
          setDistricts(data.districts);
        }
      })
      .catch((err) => console.error("Error loading districts:", err));
  }, []);

  // 🔥 Add Admin via Backend
  const addAdmin = async () => {

    if (!name || !email || !district) {
      alert("Fill all fields");
      return;
    }

    try {
      const idToken = await auth.currentUser.getIdToken();
      console.log(idToken);
      
      const response = await fetch(
        "http://localhost:8080/api/super-admin/create-admin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`
          },
          body: JSON.stringify({
            name,
            email,
            district
          })
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        alert(errorText);
        return;
      }

      const createdAdmin = await response.json();

      setAdmins([...admins, createdAdmin]);

      setName("");
      setEmail("");
      setDistrict("");

      alert("Admin Created Successfully");

    } catch (error) {
      console.error(error);
      alert("Error creating admin");
    }
  };

  return (
    <div className="super-admin-container">
      <div className="super-admin-card">

        <h2>Welcome, {user?.displayName || "Super Admin"}</h2>

        <h3>Add District Admin</h3>

        <input
          type="text"
          placeholder="Admin Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <select
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
        >
          <option value="">Select District</option>
          {districts.map((dist, index) => (
            <option key={index} value={dist}>
              {dist}
            </option>
          ))}
        </select>

        <button className="primary-btn" onClick={addAdmin}>
          Add Admin
        </button>

        <div className="admin-list">
          <h3>District Admin List</h3>

          {admins.length === 0 && <p>No admins added</p>}

          {admins.map((admin) => (
            <div key={admin.email} className="admin-item">
              <span>
                {admin.name} | {admin.email} | {admin.district}
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default SuperAdminDashboard;
