import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (!loggedInUser) {
      navigate("/"); // Redirect to login if no user found
    } else {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user"); // Clear session
    navigate("/");
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Welcome, {user.fullName}!</h1>
      <div style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "8px", maxWidth: "400px" }}>
        <h3>User Profile</h3>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>User ID:</strong> {user.id}</p>
        <button 
          onClick={handleLogout} 
          style={{ backgroundColor: "red", color: "white", padding: "10px", border: "none", cursor: "pointer" }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}