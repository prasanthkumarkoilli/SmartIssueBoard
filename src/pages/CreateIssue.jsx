import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import {
  addDoc,
  collection,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function CreateIssue() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState("Low");
  const [assignedTo, setAssignedTo] = useState("");
  const [similarIssues, setSimilarIssues] = useState([]);
  const navigate = useNavigate();
  const issuesRef = collection(db, "issues");

  // -------- SIMILAR ISSUE DETECTION --------
  useEffect(() => {
    const checkSimilar = async () => {
      if (!title.trim()) {
        setSimilarIssues([]);
        return;
      }

      try {
        const q = query(
          issuesRef,
          where("title", ">=", title.slice(0, 3)),
          where("title", "<=", title + "\uf8ff")
        );

        const snap = await getDocs(q);

        const results = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setSimilarIssues(results);
      } catch (error) {
        console.error("Error checking similar issues:", error);
      }
    };

    const delayDebounce = setTimeout(() => {
      if (title.length > 2) {
        checkSimilar();
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [title]);

  // -------- CREATE ISSUE --------
  const handleCreate = async () => {
    console.log("Create button clicked");

    try {
      if (!auth.currentUser) {
        alert("Please login to create an issue");
        return;
      }

      if (!title.trim()) {
        alert("Please enter an issue title");
        return;
      }

      if (!desc.trim()) {
        alert("Please enter a description for the issue");
        return;
      }

      await addDoc(issuesRef, {
        title: title.trim(),
        description: desc.trim(),
        priority,
        status: "Open",
        assignedTo: assignedTo.trim(),
        createdBy: auth.currentUser.email,
        createdAt: serverTimestamp(),
      });

      alert("Issue created successfully");
      navigate("/issues");

    } catch (err) {
      alert("Error creating issue: " + err.message);
      console.error("Create issue error:", err);
    }
  };

  return (
    <div className="container">
      <h2>➕ Create New Issue</h2>

      <div className="card">
        <div className="form-group">
          <label htmlFor="issueTitle">Issue Title</label>
          <input
            id="issueTitle"
            placeholder="Enter a clear, descriptive title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            placeholder="Describe the issue in detail..."
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select 
            id="priority" 
            value={priority} 
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="assignedTo">Assign To (Optional)</label>
          <input
            id="assignedTo"
            placeholder="Enter Email or Name"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
          />
        </div>

        <button className="primary-btn" onClick={handleCreate}>
          Create Issue
        </button>
      </div>

      {/* SIMILAR ISSUE SECTION */}
      {similarIssues.length > 0 && (
        <div className="card" style={{ 
          borderColor: 'rgba(255, 100, 100, 0.4)', 
          background: 'rgba(255, 50, 50, 0.08)',
          marginTop: '20px'
        }}>
          <h4 style={{ 
            color: '#ff6b6b', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px',
            marginTop: '0'
          }}>
            <span>⚠️</span> Similar Issues Found
          </h4>
          
          <p style={{ 
            color: '#ffcccb', 
            marginBottom: '15px',
            fontSize: '0.95rem'
          }}>
            {similarIssues.length} similar issue{similarIssues.length > 1 ? 's' : ''} found:
          </p>
          
          {similarIssues.map((issue) => (
            <div key={issue.id} style={{ 
              padding: '12px', 
              margin: '8px 0', 
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              borderLeft: '4px solid rgba(255, 100, 100, 0.6)'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '5px'
              }}>
                <p style={{ 
                  margin: '0', 
                  fontWeight: '500',
                  color: '#ffcccb'
                }}>
                  • {issue.title}
                </p>
                <span style={{ 
                  fontSize: '0.8rem', 
                  padding: '2px 8px',
                  borderRadius: '10px',
                  background: issue.status === 'Done' ? 'rgba(0, 255, 0, 0.2)' : 
                            issue.status === 'In Progress' ? 'rgba(255, 215, 0, 0.2)' : 
                            'rgba(0, 198, 255, 0.2)',
                  color: issue.status === 'Done' ? '#00ff00' : 
                        issue.status === 'In Progress' ? '#ffd700' : '#00c6ff',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  {issue.status}
                </span>
              </div>
              {issue.description && (
                <p style={{ 
                  margin: '5px 0 0 0', 
                  fontSize: '0.85rem', 
                  color: '#aaa',
                  fontStyle: 'italic'
                }}>
                  {issue.description.length > 100 
                    ? `${issue.description.substring(0, 100)}...` 
                    : issue.description}
                </p>
              )}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginTop: '8px',
                fontSize: '0.8rem',
                color: '#888'
              }}>
                <span>
                  Priority: <strong style={{ 
                    color: issue.priority === 'High' ? '#ff4444' : 
                           issue.priority === 'Medium' ? '#ffa500' : '#00ff00'
                  }}>{issue.priority}</strong>
                </span>
                <span>
                  By: {issue.createdBy?.split('@')[0] || 'Unknown'}
                </span>
              </div>
            </div>
          ))}
          
          <div style={{ 
            marginTop: '15px', 
            padding: '10px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '8px'
          }}>
            <p style={{ 
              color: '#ffcccb', 
              margin: '0',
              fontSize: '0.9rem'
            }}>
              <strong>Note:</strong> You may be creating a duplicate issue. 
              Please check if any of the above issues match your concern before creating a new one.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
