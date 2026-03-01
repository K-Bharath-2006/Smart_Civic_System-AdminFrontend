import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { auth } from "../auth/firebase";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "../styles/OfficeDashboard.css";

const OfficerDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [issues, setIssues] = useState([]);
  const [activeMenu, setActiveMenu] = useState("ALL");
  const [loadingIssues, setLoadingIssues] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoadingIssues(true);

        const idToken = await auth.currentUser.getIdToken();

        const response = await api.get("/officer/issues", {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });

        setIssues(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load issues");
      } finally {
        setLoadingIssues(false);
      }
    };

    if (user) {
      fetchIssues();
    }
  }, [user]);

  if (loading || loadingIssues) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  const emergencyIssues = issues.filter(
    (issue) => issue.status === "EMERGENCY"
  );

  const displayedIssues =
    activeMenu === "EMERGENCY" ? emergencyIssues : issues;

  return (
    <div className="admin-container">

      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">Officer Panel</h2>
        <ul>
          <li
            className={activeMenu === "ALL" ? "active" : ""}
            onClick={() => setActiveMenu("ALL")}
          >
            All Complaints
          </li>

          <li
            className={activeMenu === "EMERGENCY" ? "active" : ""}
            onClick={() => setActiveMenu("EMERGENCY")}
          >
            Emergency Complaints
          </li>
        </ul>
      </aside>

      {/* Main Section */}
      <main className="main">

        {/* Header with Add Worker Button */}
        <div className="header-row">
          <h2>
            {activeMenu === "ALL"
              ? "All Complaints"
              : "Emergency Complaints"}
          </h2>

          <button
            className="add-worker-btn"
            onClick={() => navigate("/addworker")}
          >
            + Add Worker
          </button>
        </div>

        {/* KPI Section */}
        <div className="kpis">
          <Kpi title="Total Issues" value={issues.length} />
          <Kpi title="Emergency Issues" value={emergencyIssues.length} />
        </div>

        {/* Issues Table */}
        <section className="card table-card">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Subdivision</th>
                <th>Category</th>
                <th>Status</th>
                <th>Verified</th>
              </tr>
            </thead>

            <tbody>
              {displayedIssues.length === 0 ? (
                <tr>
                  <td colSpan="5">No complaints found</td>
                </tr>
              ) : (
                displayedIssues.map((issue) => (
                  <tr
                    key={issue.issueId}
                    onClick={() =>
                      navigate(`/officer/issue/${issue.issueId}`)
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <td>{issue.issueId}</td>
                    <td>{issue.subdivision}</td>
                    <td>{issue.category}</td>
                    <td>
                      <span
                        className={`badge ${issue.status.toLowerCase()}`}
                      >
                        {issue.status}
                      </span>
                    </td>
                    <td>
                      {issue.verified ? (
                        <span className="verified">✔</span>
                      ) : (
                        <span className="not-verified">✖</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

const Kpi = ({ title, value }) => (
  <div className="kpi-card">
    <span>{title}</span>
    <h2>{value}</h2>
  </div>
);

export default OfficerDashboard;
