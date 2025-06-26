import React from "react";
import { Link } from "react-router-dom";

export default function header() {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/register">Register</Link>
        <Link to="/login">Login</Link>
      </nav>
    </div>
  );
}
