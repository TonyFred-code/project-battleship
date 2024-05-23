import HumanPlayer from './human-player.js';
import ComputerPlayer from './computer-player.js';

export default class GameRound {
  #HUMAN_PLAYER = null;

  #COMPUTER_PLAYER = null;

  #activePlayer = null;

  #HIT_STATUS_0 = 0;

  #HIT_STATUS_1 = 1;

  #isValidHitStatus(hitStatus) {
    return hitStatus === this.#HIT_STATUS_0 || hitStatus === this.#HIT_STATUS_1;
  }

  #switchActivePlayer() {
    if (this.#activePlayer === this.#HUMAN_PLAYER) {
      this.#activePlayer = this.#COMPUTER_PLAYER;
    } else if (this.#activePlayer === this.#COMPUTER_PLAYER) {
      this.#activePlayer = this.#HUMAN_PLAYER;
    }
  }

  #setActivePlayer() {
    let activePlayer = null;

    if (this.#canAddPlayer()) return activePlayer;

    const random = Math.floor(Math.random() + 1);
    if (random % 2 === 0) {
      activePlayer = this.#COMPUTER_PLAYER;
    } else {
      activePlayer = this.#HUMAN_PLAYER;
    }

    return activePlayer;
  }

  #canAddPlayer() {
    return this.#COMPUTER_PLAYER === null || this.#HUMAN_PLAYER === null;
  }

  addBotPlayer() {
    if (this.#COMPUTER_PLAYER !== null) return false;

    this.#COMPUTER_PLAYER = new ComputerPlayer();

    if (!this.#canAddPlayer()) {
      this.#activePlayer = this.#COMPUTER_PLAYER;
    }

    return true;
  }

  addHumanPlayer(playerName) {
    if (typeof playerName !== 'string' || playerName.trim() === '') {
      return false;
    }

    if (this.#HUMAN_PLAYER !== null) return false;

    this.#HUMAN_PLAYER = new HumanPlayer(playerName);

    if (!this.#canAddPlayer()) {
      this.#activePlayer = this.#HUMAN_PLAYER;
    }

    return true;
  }

  getActivePlayer() {
    if (this.#activePlayer === null) return null;

    const playerName = this.#activePlayer.name;

    return {
      playerName,
    };
  }

  removePlayers() {
    this.#COMPUTER_PLAYER = null;
    this.#HUMAN_PLAYER = null;
    this.#activePlayer = null;
  }

  humanPlayerDetails() {
    if (this.#HUMAN_PLAYER === null) return null;

    const playerName = this.#HUMAN_PLAYER.name;

    return {
      playerName,
    };
  }

  botPlayerDetails() {
    if (this.#COMPUTER_PLAYER === null) return null;

    const playerName = this.#COMPUTER_PLAYER.name;

    return {
      playerName,
    };
  }

  botShipDetails() {
    return this.#COMPUTER_PLAYER.shipPlacements();
  }

  humanPlayerShipDetails() {
    return this.#HUMAN_PLAYER.shipPlacements();
  }

  placeHumanPlayerCarrier(x, y, orientation = 'horizontal') {
    return this.#HUMAN_PLAYER.placeCarrier(x, y, orientation);
  }

  placeHumanPlayerBattleShip(x, y, orientation = 'horizontal') {
    return this.#HUMAN_PLAYER.placeBattleShip(x, y, orientation);
  }

  placeHumanPlayerDestroyer(x, y, orientation = 'horizontal') {
    return this.#HUMAN_PLAYER.placeDestroyer(x, y, orientation);
  }

  placeHumanPlayerSubMarine(x, y, orientation = 'horizontal') {
    return this.#HUMAN_PLAYER.placeSubMarine(x, y, orientation);
  }

  placeHumanPlayerPatrolBoat(x, y, orientation = 'horizontal') {
    return this.#HUMAN_PLAYER.placePatrolBoat(x, y, orientation);
  }

  autoPlaceHumanShips() {
    return this.#HUMAN_PLAYER.autoPlaceShips();
  }

  autoPlaceBotShips() {
    return this.#COMPUTER_PLAYER.autoPlaceShips();
  }

  botMove(x, y) {
    if (this.#activePlayer !== this.#COMPUTER_PLAYER) return -1;

    const hitStatus = this.#HUMAN_PLAYER.receiveAttack(x, y);

    if (this.#isValidHitStatus(hitStatus)) {
      this.#switchActivePlayer();
    }

    return hitStatus;
  }

  humanPlayerMove(x, y) {
    if (this.#activePlayer !== this.#HUMAN_PLAYER) return -1;

    const hitStatus = this.#COMPUTER_PLAYER.receiveAttack(x, y);

    if (this.#isValidHitStatus(hitStatus)) {
      this.#switchActivePlayer();
    }

    return hitStatus;
  }
}

// function GameRound2() {
//   const gameBoard = GameBoard();

//   const players = [];

//   const removePlayers = () => {
//     if (players.length === 0) {
//       console.log("add players before removing them");
//       return;
//     }
//     players.splice(0, players.length);
//   };

//   const addHumanPlayer = (name, marker) => {
//     if (!name || !marker) {
//       return;
//     }

//     if (playersComplete()) {
//       console.warn(`Refused to add ${name}. Players complete.`);
//       return;
//     }

//     players.push(HumanPlayer(name, marker));
//     console.info(`Added ${name}. Assigned "${marker}" as marker.`);
//     assignActivePlayer();
//   };

//   const addBotPlayer = (name, marker) => {
//     if (!name || !marker) {
//       return;
//     }

//     if (playersComplete()) {
//       console.warn(`Refused to add ${name}. Players complete`);
//       return;
//     }

//     players.push(Computer(name, marker));
//     console.info(`Added ${name} as Bot. Assigned "${marker}" as marker.`);
//     assignActivePlayer();
//   };

//   const playersComplete = () => {
//     if (players.length === 2) {
//       return true;
//     } else {
//       return false;
//     }
//   };

//   // ensures player with marker = "X" plays first;
//   let activePlayer = null;

//   const assignActivePlayer = () => {
//     if (playersComplete()) {
//       activePlayer = players[0].getMarker() === "X" ? players[0] : players[1];
//     }
//   };

//   // switches active player
//   //   prints turn for new active player
//   const switchActivePlayer = () => {
//     activePlayer = activePlayer === players[0] ? players[1] : players[0];
//   };

//   // allows easier access to active player
//   const getActivePlayer = () => activePlayer;

//   //   variables to check against while making move (win or tie)
//   // let winnerFound = false;
//   // let gameDraw = false;

//   const roundState = {
//     winnerName: "",
//     winnerMarker: "",
//     gameTied: false,
//     gameWon: false,
//   };

//   const getRoundState = () => roundState;

//   const rowWin = () => {
//     let rows = gameBoard.rowWin();

//     for (const key in rows) {
//       if (rows[key]) {
//         return rows[key];
//       }
//     }
//     return false;
//   };

//   const columnWin = () => {
//     let columns = gameBoard.columnWin();

//     for (const key in columns) {
//       if (columns[key]) {
//         return columns[key];
//       }
//     }
//     return false;
//   };

//   const diagonalWin = () => {
//     let diagonals = gameBoard.diagonalWin();

//     for (const key in diagonals) {
//       if (diagonals[key]) {
//         return diagonals[key];
//       }
//     }

//     return false;
//   };

//   const checkWin = () => {
//     let diagonalWinArr = diagonalWin();
//     let columnWinArr = columnWin();
//     let rowWinArr = rowWin();
//     let win = false;

//     if (diagonalWinArr || columnWinArr || rowWinArr) {
//       win = true;
//     }

//     return win;
//   };

//   let winCells = null;

//   const getWinCellsArr = () => {
//     let arr = [];
//     let diagonalWinArr = diagonalWin();
//     let columnWinArr = columnWin();
//     let rowWinArr = rowWin();

//     if (diagonalWinArr) {
//       arr.push(...diagonalWinArr);
//     }

//     if (columnWinArr) {
//       arr.push(...columnWinArr);
//     }

//     if (rowWinArr) {
//       arr.push(...rowWinArr);
//     }

//     return arr;
//   };

//   const setWinCells = () => {
//     let arr = getWinCellsArr();

//     winCells = arr;
//   };

//   const getWinCells = () => {
//     return winCells;
//   };

//   //   making move logic
//   //   disallows moving if a winner has been found or game is drawn
//   //   makes move
//   // checks for win or tie after making move
//   //   switch active player to next player

//   //   const getIndex = (row, column) => {
//   //     let store = {
//   //       "0, 0": 0,
//   //       "0, 1": 1,
//   //       "0, 2": 2,
//   //       "1, 0": 3,
//   //       "1, 1": 4,
//   //       "1, 2": 5,
//   //       "2, 0": 6,
//   //       "2, 1": 7,
//   //       "2, 2": 8,
//   //     };

//   //     return store[`${row}, ${column}`];
//   //   };

//   const move = (cellPos) => {
//     if (roundState.gameWon) {
//       console.warn("Winner Found. Move Disallowed");
//       return;
//     }

//     if (roundState.gameTied) {
//       console.warn("Game Drawn.");
//       return;
//     }

//     const currentPlayer = getActivePlayer();

//     if (currentPlayer === null) {
//       console.warn("Add two human players or one bot one human to play round");
//       return;
//     }

//     const playerName = currentPlayer.getName();
//     const playerMarker = currentPlayer.getMarker();

//     console.log(
//       `${playerName} wants to add his marker - ${playerMarker} to Cell Position ${cellPos}`
//     );

//     // check if making a move should be allowed;
//     // such as when game is tied or winner has been;

//     console.log(`Adding marker - ${playerMarker} to Cell Position ${cellPos}`);

//     // let cellPosition = getIndex(row, column);

//     const markerAdded = gameBoard.addMarker(cellPos, playerMarker);

//     if (!markerAdded) {
//       console.warn("Failed to Add Marker");
//       return;
//     }

//     console.log(`Added marker - ${playerMarker} to Cell Position ${cellPos}`);
//     console.log("Printing New Board");
//     console.log(gameBoard.printBoard());

//     roundState.gameWon = checkWin();

//     if (roundState.gameWon) {
//       roundState.winnerName = playerName;
//       roundState.winnerMarker = playerMarker;
//       setWinCells();
//       console.info(
//         `${roundState.winnerName}  Wins this round. Marker ${playerMarker} takes it.`
//       );
//       console.log(roundState.gameWon);
//       return;
//     }

//     roundState.gameTied = gameBoard.drawGame();

//     if (roundState.gameTied) {
//       console.info("NOBODY WINS.");
//       return;
//     }

//     switchActivePlayer();
//   };

//   return {
//     move,
//     getActivePlayer,
//     removePlayers,
//     addBotPlayer,
//     addHumanPlayer,
//     getBoard: gameBoard.getBoard,
//     printBoard: gameBoard.printBoard,
//     getRoundState,
//     getWinCells,
//     // columnWin,
//     // rowWin,
//     // diagonalWin,
//   };
// }
