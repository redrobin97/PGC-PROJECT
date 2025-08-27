//utility functions for all games
const {
  getDeckbyId,
  updateDeckPosition,
  assignHandCards,
  removeDeckCards,
} = require("../../db/querys/games");

function shuffle(cards) {
  for (let i = 0; i < cards.length; i++) {
    let temp = cards[i];
    let random = Math.floor(Math.random() * cards.length);
    cards[i] = cards[random];
    cards[random] = temp;
  }
  return cards;
}

async function drawFromDeck({ player, game, numberToDraw }) {
  try {
    let oldDeck = await getDeckbyId(game.id);
    let newCards = [];

    //draw cards
    for (let i = 0; i < numberToDraw; i++) {
      newCards.push(oldDeck.find((card) => card.position == i));
      oldDeck = oldDeck.filter((card) => card.position !== i);
    }

    //push new cards to hand & delete cards from deck
    for (let i = 0; i < newCards.length; i++) {
      const handResult = await assignHandCards({
        game,
        player,
        card: newCards[i],
      });
      const removeResult = await removeDeckCards({ game, card: newCards[i] });
      if (!handResult)
        console.log(
          "error at ASSIGNHANDPOSITIONS in f(DRAWFROMDECK) /api/games/game_utils"
        );
      if (!removeResult)
        console.log(
          "error at REMOVECARDSFROMDECK in f(DRAWFROMDECK) /api/games/game_utils"
        );
    }

    //update deck card positions
    oldDeck.forEach((card) => {
      card.position -= numberToDraw;
    });
    for (let i = 0; i < oldDeck.length; i++) {
      const result = await updateDeckPosition({
        game,
        card: oldDeck[i],
        position: oldDeck[i].position,
      });
      if (!result)
        console.log(
          "error at UPDATECARDPOSITIONS in f(DRAWFROMDECK) /api/games/game_utils"
        );
    }

    return newCards;
  } catch (err) {
    throw err;
  }
}

module.exports = { shuffle, drawFromDeck };
