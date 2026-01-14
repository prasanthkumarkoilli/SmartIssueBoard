import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Account created successfully!");
      navigate("/dashboard");
    } catch (error) {
      alert("Signup failed: " + error.message);
    }
  };

  return (
    <div className="container">
      <h2>📝 Create New Account</h2>

      <div className="card">
        <div className="form-group">
          <label htmlFor="signupEmail">Email</label>
          <input 
            id="signupEmail"
            type="email"
            placeholder="Enter your email" 
            value={email}
            onChange={(e)=>setEmail(e.target.value)} 
          />
        </div>

        <div className="form-group">
          <label htmlFor="signupPassword">Password</label>
          <input 
            id="signupPassword"
            type="password" 
            placeholder="Create a strong password" 
            value={password}
            onChange={(e)=>setPassword(e.target.value)} 
          />
        </div>

        <button className="primary-btn" onClick={handleSignup}>
          Create Account
        </button>

        <p style={{ textAlign: 'center', marginTop: '20px' }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: '#00ffea' }}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
