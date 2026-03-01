import { useState, useEffect } from "react";
import { auth } from "../auth/firebase";
import api from "../api/api";
import "../styles/AdminDashboard.css";

function AdminDashboard() {

  const [locationData, setLocationData] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [district, setDistrict] = useState("");
  const [taluk, setTaluk] = useState("");
  const [ondriyam, setOndriyam] = useState("");
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Load Taluk JSON
  useEffect(() => {
    fetch("/data/Taluk.json")
      .then((res) => res.json())
      .then((data) => {
        if (data.districts && Array.isArray(data.districts)) {
          setLocationData(data.districts);
        }
      })
      .catch((err) => console.error("Error loading JSON:", err));
  }, []);

  const selectedDistrict = locationData.find(
    (d) => d.district === district
  );

  const talukList = selectedDistrict ? selectedDistrict.taluks : [];

  const selectedTaluk = talukList.find(
    (t) => t.taluk === taluk
  );

  const ondriyamList = selectedTaluk ? selectedTaluk.ondrims : [];

  // 🔥 Create Officer (API CALL)
  const handleAddOfficer = async () => {

    if (!name || !email || !district || !taluk || !ondriyam) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const idToken = await auth.currentUser.getIdToken();

      const response = await api.post(
        "/admin/create-officer",
        {
          name,
          email,
          district,
          taluk,
          subdivision: ondriyam   // 🔥 must match backend model
        },
        {
          headers: {
            Authorization: `Bearer ${idToken}`
          }
        }
      );

      const createdOfficer = response.data;

      setOfficers([...officers, createdOfficer]);

      // Clear form
      setName("");
      setEmail("");
      setDistrict("");
      setTaluk("");
      setOndriyam("");

      alert("Officer Created Successfully");

    } catch (error) {
      console.error(error);
      alert(error.response?.data || "Error creating officer");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveOfficer = (email) => {
    setOfficers(officers.filter((officer) => officer.email !== email));
  };

  return (
    <div className="admin-dashboard-container">
      <h1>Admin Dashboard</h1>

      <div className="add-officer-form">
        <h3>Add New Officer</h3>

        <input
          type="text"
          placeholder="Officer Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Officer Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <select
          value={district}
          onChange={(e) => {
            setDistrict(e.target.value);
            setTaluk("");
            setOndriyam("");
          }}
        >
          <option value="">Select District</option>
          {locationData.map((d, index) => (
            <option key={index} value={d.district}>
              {d.district}
            </option>
          ))}
        </select>

        <select
          value={taluk}
          onChange={(e) => {
            setTaluk(e.target.value);
            setOndriyam("");
          }}
          disabled={!district}
        >
          <option value="">Select Taluk</option>
          {talukList.map((t, index) => (
            <option key={index} value={t.taluk}>
              {t.taluk}
            </option>
          ))}
        </select>

        <select
          value={ondriyam}
          onChange={(e) => setOndriyam(e.target.value)}
          disabled={!taluk}
        >
          <option value="">Select Ondriyam</option>
          {ondriyamList.map((o, index) => (
            <option key={index} value={o}>
              {o}
            </option>
          ))}
        </select>

        <button onClick={handleAddOfficer} disabled={loading}>
          {loading ? "Creating..." : "Add Officer"}
        </button>
      </div>

      <h3>Officer List</h3>

      {officers.length === 0 && <p>No officers added</p>}

      {officers.map((officer) => (
        <div key={officer.email} className="officer-card">
          <p><b>Name:</b> {officer.name}</p>
          <p><b>Email:</b> {officer.email}</p>
          <p><b>District:</b> {officer.district}</p>
          <p><b>Taluk:</b> {officer.taluk}</p>
          <p><b>Subdivision:</b> {officer.subdivision}</p>

          <button onClick={() => handleRemoveOfficer(officer.email)}>
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}

export default AdminDashboard;
