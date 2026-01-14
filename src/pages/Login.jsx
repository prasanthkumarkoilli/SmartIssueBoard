import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Welcome back! 👋");
      navigate("/dashboard");
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

  return (
    <div className="container">
      <h2>🔐 Login to Your Account</h2>

      <div className="card">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input 
            id="email"
            type="email"
            placeholder="Enter your email" 
            value={email}
            onChange={(e)=>setEmail(e.target.value)} 
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input 
            id="password"
            type="password" 
            placeholder="Enter your password" 
            value={password}
            onChange={(e)=>setPassword(e.target.value)} 
          />
        </div>

        <button className="primary-btn" onClick={handleLogin}>
          Login
        </button>

        <p style={{ textAlign: 'center', marginTop: '20px' }}>
          Don't have an account?{" "}
          <Link to="/signup" style={{ color: '#00ffea' }}>
            Create one here
          </Link>
        </p>
      </div>
    </div>
  );
}
