import { useState, useEffect } from "react";
import { auth } from "../auth/firebase";
import api from "../api/api";
import "../styles/AddWorker.css";

function AddWorker() {

  const [locationData, setLocationData] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [district, setDistrict] = useState("");
  const [taluk, setTaluk] = useState("");
  const [ondriyam, setOndriyam] = useState("");
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);

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

  // 🔥 ADD WORKER
  const handleAddWorker = async () => {

    if (!name || !email || !phone || !district || !taluk || !ondriyam) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const idToken = await auth.currentUser.getIdToken();

      const response = await api.post(
        "/officer/create-worker",   // 🔥 backend endpoint
        {
          name,
          email,
          phone,
          district,
          taluk,
          subdivision: ondriyam
        },
        {
          headers: {
            Authorization: `Bearer ${idToken}`
          }
        }
      );

      const createdWorker = response.data;

      setWorkers([...workers, createdWorker]);

      // Clear form
      setName("");
      setEmail("");
      setPhone("");
      setDistrict("");
      setTaluk("");
      setOndriyam("");

      alert("Worker Created Successfully");

    } catch (error) {
      console.error(error);
      alert(error.response?.data || "Error creating worker");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 DELETE WORKER
  const handleDeleteWorker = async (workerEmail) => {

    try {
      const idToken = await auth.currentUser.getIdToken();

      await api.delete(`/officer/delete-worker/${workerEmail}`, {
        headers: {
          Authorization: `Bearer ${idToken}`
        }
      });

      setWorkers(workers.filter((w) => w.email !== workerEmail));

      alert("Worker Deleted Successfully");

    } catch (error) {
      console.error(error);
      alert("Error deleting worker");
    }
  };

  return (
    <div className="worker-dashboard-container">

      <h1>Worker Management</h1>

      <div className="add-worker-form">

        <h3>Add New Worker</h3>

        <input
          type="text"
          placeholder="Worker Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Worker Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        {/* District */}
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

        {/* Taluk */}
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

        {/* Ondriyam */}
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

        <button onClick={handleAddWorker} disabled={loading}>
          {loading ? "Creating..." : "Add Worker"}
        </button>

      </div>
  
        <div>
          <button
            className="delete-btn"
            onClick={() => handleDeleteWorker(workers.email)}
          >
            Delete
          </button>
        </div>

    </div>
  );
}

export default AddWorker;
