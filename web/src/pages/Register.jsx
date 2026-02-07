import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/register`, formData);
      alert("Registration Successful! Please Login.");
      navigate("/");
    } catch (error) {
      alert("Error: " + (error.response?.data || "Registration failed"));
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input 
            placeholder="Full Name" 
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} 
            required 
            style={{ display: "block", marginBottom: "10px", padding: "8px" }}
          />
        </div>
        <div>
          <input 
            type="email" 
            placeholder="Email" 
            onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
            required 
            style={{ display: "block", marginBottom: "10px", padding: "8px" }}
          />
        </div>
        <div>
          <input 
            type="password" 
            placeholder="Password" 
            onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
            required 
            style={{ display: "block", marginBottom: "10px", padding: "8px" }}
          />
        </div>
        <button type="submit">Register</button>
      </form>
      <p>Already have an account? <a href="/">Login here</a></p>
    </div>
  );
}