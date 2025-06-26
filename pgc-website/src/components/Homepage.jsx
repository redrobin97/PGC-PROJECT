import React from "react";
import { useNavigate } from "react-router-dom";

export default function homepage() {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate("/play21");
  };

  return (
    <div>
      <button onClick={handleNavigation}>Play 21?</button>
    </div>
  );
}
