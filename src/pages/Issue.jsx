import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth } from "../auth/firebase";
import api from "./../api/api";
import "../styles/Issue.css";

const Issue = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState(null);

  useEffect(() => {

    const fetchIssue = async () => {
      try {
        const idToken = await auth.currentUser.getIdToken();

        const response = await api.get(
          `/officer/issues/${id}`,
          {
            headers: {
              Authorization: `Bearer ${idToken}`
            }
          }
        );

        setIssue(response.data);

      } catch (error) {
        console.error(error);
      }
    };

    fetchIssue();

  }, [id]);

  if (!issue) return <div>Loading...</div>;

 return (
  <div className="issue-wrapper">

    <div className="issue-header">
      <button className="back-btn" onClick={() => navigate("/officer")}>
        ← Back to Dashboard
      </button>

      <h2>Complaint Details</h2>
    </div>

    <div className="issue-card">

      {/* Left Section */}
      <div className="issue-left">

        <div className="info-grid">
          <div className="info-item">
            <span>ID</span>
            <p>{issue.issueId}</p>
          </div>

          <div className="info-item">
            <span>Subdivision</span>
            <p>{issue.subdivision}</p>
          </div>

          <div className="info-item">
            <span>Category</span>
            <p>{issue.category}</p>
          </div>

          <div className="info-item">
            <span>Status</span>
            <span className={`status-badge ${issue.status.toLowerCase()}`}>
              {issue.status}
            </span>
          </div>

          <div className="info-item">
            <span>Verified</span>
            <p className={issue.verified ? "verified" : "not-verified"}>
              {issue.verified ? "✔ Verified" : "✖ Not Verified"}
            </p>
          </div>
        </div>

        <div className="description-section">
          <h4>Description</h4>
          <p>{issue.description}</p>
        </div>

        <button
          className="assign-work-btn"
          onClick={() => navigate(`/assign-work/${issue.issueId}`)}
        >
          Assign Work
        </button>

      </div>

      {/* Right Section (Image) */}
      {issue.imageUrl && (
        <div className="issue-right">
          <h4>Complaint Evidence</h4>
          <img
            src={issue.imageUrl}
            alt="Complaint Evidence"
            className="issue-image"
          />
        </div>
      )}

    </div>
  </div>
);

};

export default Issue;
