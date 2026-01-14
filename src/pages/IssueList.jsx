import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  getDocs,
  orderBy,
  query,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

export default function IssueList() {
  const [issues, setIssues] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [deleteModal, setDeleteModal] = useState({ show: false, issue: null });
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Get current user
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  const fetchIssues = async () => {
    let q = query(collection(db, "issues"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    let data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

    if (statusFilter !== "All") {
      data = data.filter((i) => i.status === statusFilter);
    }
    if (priorityFilter !== "All") {
      data = data.filter((i) => i.priority === priorityFilter);
    }

    setIssues(data);
  };

  useEffect(() => {
    fetchIssues();
  }, [statusFilter, priorityFilter]);

  const updateStatus = async (issue, newStatus) => {
    if (issue.status === "Open" && newStatus === "Done") {
      alert("Cannot move from Open to Done. Please move to In Progress first.");
      return;
    }

    try {
      await updateDoc(doc(db, "issues", issue.id), { status: newStatus });
      fetchIssues();
    } catch (error) {
      alert("Error updating status: " + error.message);
    }
  };

  const handleDeleteClick = (issue) => {
    setDeleteModal({ show: true, issue });
  };

  const confirmDelete = async () => {
    if (!deleteModal.issue) return;

    try {
      await deleteDoc(doc(db, "issues", deleteModal.issue.id));
      setDeleteModal({ show: false, issue: null });
      fetchIssues();
      alert("Issue deleted successfully!");
    } catch (error) {
      alert("Error deleting issue: " + error.message);
    }
  };

  const Dashboard = (issue) => {
    setDeleteModal({ show: true, issue });
  };
  const cancelDelete = () => {
    setDeleteModal({ show: false, issue: null });
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "High": return "priority-high";
      case "Medium": return "priority-medium";
      case "Low": return "priority-low";
      default: return "";
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Open": return "status-open";
      case "In Progress": return "status-progress";
      case "Done": return "status-done";
      default: return "";
    }
  };

  // Check if current user can delete the issue (creator or admin)
  const canDeleteIssue = (issue) => {
    if (!currentUser) return false;
    return currentUser.email === issue.createdBy;
  };

  return (
    <div className="container">
      <h2>📋 Issue Management</h2>
      
      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="delete-confirmation">
          <div className="delete-modal">
            <h3>🗑️ Delete Issue</h3>
            <p>
              Are you sure you want to delete the issue:<br />
              <strong>"{deleteModal.issue?.title}"</strong>?
            </p>
            <p style={{ color: '#ff6b6b', fontSize: '0.9rem' }}>
              This action cannot be undone!
            </p>
            <div className="delete-modal-actions">
              <button className="secondary-btn" onClick={cancelDelete}>
                Cancel
              </button>
              <button className="danger-btn" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="card">
        <h3>🔍 Filters</h3>
        <div className="filter-section">
          <div>
            <p>Filter by Status:</p>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>
          
          <div>
            <p>Filter by Priority:</p>
            <select 
              value={priorityFilter} 
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="All">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>
          📊 Issues ({issues.length})
          {statusFilter !== "All" && ` - ${statusFilter}`}
          {priorityFilter !== "All" && ` - ${priorityFilter} Priority`}
        </h3>
        
        {issues.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>No issues found with the current filters.</p>
          </div>
        ) : (
          <div className="issues-grid">
            {issues.map((issue) => (
              <div key={issue.id} className="issue-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <h3 style={{ margin: '0 0 10px 0', flex: 1 }}>{issue.title}</h3>
                  <span className={`priority-badge ${getPriorityClass(issue.priority)}`}>
                    {issue.priority}
                  </span>
                </div>
                
                <p style={{ color: '#ccc', marginBottom: '15px' }}>
                  {issue.description}
                </p>
                
                <div style={{ marginBottom: '15px' }}>
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <span className={`status-badge ${getStatusClass(issue.status)}`}>
                      {issue.status}
                    </span>
                  </div>
                  
                  <p style={{ margin: '5px 0' }}>
                    <strong>Assigned to:</strong> {issue.assignedTo || 'Unassigned'}
                  </p>
                  <p style={{ margin: '5px 0' }}>
                    <strong>Created by:</strong> {issue.createdBy}
                  </p>
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                  <p style={{ marginBottom: '8px' }}>Update Status:</p>
                  <select
                    value={issue.status}
                    onChange={(e) => updateStatus(issue, e.target.value)}
                    style={{ width: '100%' }}
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
                
                {/* Delete Button - Only shown for issue creator */}
                {canDeleteIssue(issue) && (
                  <div className="action-buttons">
                    <button 
                      className="danger-btn"
                      onClick={() => handleDeleteClick(issue)}
                    >
                      🗑️ Delete Issue
                    </button>
                  </div>
                )}
                
                {!canDeleteIssue(issue) && currentUser && (
                  <p style={{ 
                    fontSize: '0.8rem', 
                    color: '#888', 
                    textAlign: 'center',
                    marginTop: '10px'
                  }}>
                    Only the creator can delete this issue
                  </p>
                  
                )}
                
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
