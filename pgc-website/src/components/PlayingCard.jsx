import React from "react";

export default function PlayingCard({ card }) {
  const { id, name, suit, value } = card;
  return (
    <>
      <p>{name}</p>
      <p>{suit}</p>
      <p>{value}</p>
    </>
  );
}
