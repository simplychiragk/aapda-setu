// pages/Logout.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate clearing user session
    setTimeout(() => {
      alert("You have been logged out!");
      navigate("/"); // Redirect to dashboard
    }, 1000);
  }, [navigate]);

  return (
    <div style={{ padding: 20 }}>
      <h1>Logging out...</h1>
      <p>Please wait while we log you out.</p>
    </div>
  );
}
