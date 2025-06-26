import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { initializeGameData } from "../api";
import "./css/play21.css";
import PlayingCard from "./PlayingCard";

export default function play21() {
  const navigate = useNavigate();
  const [deck, setDeck] = useState([]);
  const [gameId, setGameId] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [handTotal, setHandTotal] = useState(0);
  const [newGame, setNewGame] = useState("");

  const handleNavigation = () => {
    navigate("/");
  };

  const handleNewGame = () => {
    setNewGame((prevState) => !prevState);
  };

  useEffect(() => {
    async function initializeGame() {
      try {
        const gameData = await initializeGameData();
        setDeck(gameData.deck);
        setGameId(gameData.gameId);
        setPlayerHand(gameData.playerHand);
        setDealerHand(gameData.dealerHand);
      } catch (err) {
        throw err;
      }
    }
    initializeGame();
  }, [newGame]);

  useEffect(() => {
    function handTotal() {
      let total = 0;
      let aceCount = 0;
      playerHand.forEach((card) => {
        if (card.value === "Ace") {
          total += 11;
          aceCount += 1;
        } else {
          total += card.value;
        }
      });
      while (total > 21 && aceCount > 0) {
        total -= 10;
        aceCount--;
      }
      setHandTotal(total);
    }
    handTotal();
  }, [playerHand]);

  //   useEffect(() => {
  //     console.log("new game", gameId);
  //   }, [gameId]);

  return (
    <div>
      <button onClick={handleNavigation}>Homepage</button>
      <h1>{gameId}</h1>
      <div className="game-board">
        <div className="deck">
          {deck.length > 0 ? (
            <PlayingCard card={deck[deck.length - 1]} />
          ) : (
            <p>Loading deck...</p>
          )}
        </div>
        <div className="player-cards">
          <div className="player-card-facedown">
            {deck.length > 0 ? (
              <PlayingCard card={playerHand[0]} />
            ) : (
              <p>Loading deck...</p>
            )}
          </div>
          <div className="player-cards-faceup">
            {deck.length > 0 ? (
              <PlayingCard card={playerHand[1]} />
            ) : (
              <p>Loading deck...</p>
            )}
          </div>
        </div>
      </div>
      <div className="info-box">
        <h1>Total:{handTotal}</h1>
        <button>HIT</button>
        <button onClick={handleNewGame}>NEW GAME</button>
      </div>
    </div>
  );
}
