import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [userEmail, setUserEmail] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        setUserEmail(null);
      }
    });

    return () => unsub();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <div className="container">

      {!userEmail ? (
        <>
          <div className="card">
            <h3>Get Started </h3>
            <p>Please login or create an account to start managing your issues.</p>
          </div>

          <div className="card" style={{ textAlign: 'center' }}>
            <Link className="link-btn" to="/login">
              🔐 Login to Your Account
            </Link>
            <Link className="link-btn" to="/signup">
              📝 Create New Account
            </Link>
          </div>
        </>
      ) : (
        <>
          <div className="card">
            <h3> Welcome, {userEmail.split('@')[0]}</h3>
            <p><strong>Logged in as:</strong> {userEmail}</p>
          </div>

          <div className="card">
            <h3>📊 Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link className="link-btn" to="/create" style={{ textAlign: 'center' }}>
                ➕ Create New Issue
              </Link>
              <Link className="link-btn" to="/issues" style={{ textAlign: 'center' }}>
                📋 View All Issues
              </Link>
            </div>
          </div>

          <div className="card">
            <h3>⚙️ Account Management</h3>
            <button className="danger-btn" onClick={handleLogout}>
              🚪 Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
