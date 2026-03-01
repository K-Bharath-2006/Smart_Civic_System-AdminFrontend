import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth } from "../auth/firebase";
import api from "../api/api";
import "../styles/AssignWork.css";

const AssignWork = () => {

  const { issueId } = useParams();
  const navigate = useNavigate();

  const [workerEmail, setWorkerEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAssign = async () => {

  if (!workerEmail) {
    alert("Enter Worker Email");
    return;
  }

  try {
    setLoading(true);

    const idToken = await auth.currentUser.getIdToken();

    await api.post(
      `/officer/assign/${issueId}?workerEmail=${encodeURIComponent(workerEmail)}`,
      null,
      {
        headers: {
          Authorization: `Bearer ${idToken}`
        }
      }
    );

    alert("Issue Assigned Successfully");
    navigate("/officer");

  } catch (error) {
    console.error(error);
    alert("Error assigning issue");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="assign-container">

      <div className="assign-card">

        <h2>Assign Work</h2>
        <p><strong>Issue ID:</strong> {issueId}</p>

        <input
          type="email"
          placeholder="Enter Worker Email"
          value={workerEmail}
          onChange={(e) => setWorkerEmail(e.target.value)}
        />

        <button onClick={handleAssign} disabled={loading}>
          {loading ? "Assigning..." : "Assign Work"}
        </button>

      </div>

    </div>
  );
};

export default AssignWork;
