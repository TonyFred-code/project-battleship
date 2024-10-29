import createLoadScreen from './dom_module/loading-screen.js';
import createHomePage from './dom_module/home-page.js';
import createPlaySetupPage from './dom_module/play-setup.js';
import createGamePlayPage from './dom_module/game-play.js';
import createRoundLossPage from './dom_module/round-loss-modal.js';
import createRoundWinPage from './dom_module/round-win-modal.js';
import createTutorialPage from './dom_module/tutorial-page.js';

import GameController from './game-controller.js';

import './style.css';
import GameBoard from './game-board.js';

const GAME_CONTROLLER = new GameController();

const LOAD_SCREEN = createLoadScreen();
const HOME_PAGE_SCREEN = createHomePage();
const ROUND_LOSS_MODAL = createRoundLossPage();
const ROUND_WIN_MODAL = createRoundWinPage();
const TUTORIAL_PAGE_SCREEN = createTutorialPage();
let PLAY_SETUP_SCREEN;
let GAME_PLAY_SCREEN;

const DOC_BODY = document.querySelector('body');

function changeScreen(incoming, delay = 100) {
  const container = document.querySelector('body');

  setTimeout(() => {
    container.innerHTML = '';
    container.appendChild(incoming);
  }, delay);
}

function openModal(modalEl) {
  DOC_BODY.appendChild(modalEl);
  modalEl.showModal();
}

function closeModal(modalEl) {
  modalEl.close();
  DOC_BODY.removeChild(modalEl);
}

TUTORIAL_PAGE_SCREEN.homeBtn.addEventListener('click', () => {
  changeScreen(HOME_PAGE_SCREEN.homePageContainer);
});

ROUND_LOSS_MODAL.homeBtn.addEventListener('click', () => {
  closeModal(ROUND_LOSS_MODAL.roundLossDialog);

  changeScreen(LOAD_SCREEN.loadingScreenContainer);
});

ROUND_WIN_MODAL.homeBtn.addEventListener('click', () => {
  closeModal(ROUND_WIN_MODAL.roundWinDialog);

  changeScreen(LOAD_SCREEN.loadingScreenContainer);
});

function attachShipToBoard(shipInfo, activeShip) {
  const { isOnBoard, placeHead, size, orientation } = shipInfo;

  if (!isOnBoard) {
    activeShip.classList.add('fail-place');

    setTimeout(() => {
      activeShip.classList.remove('fail-place');
    }, 800);
    return [];
  }

  const [x, y] = placeHead;

  PLAY_SETUP_SCREEN.boardNodesContainer.appendChild(activeShip);
  const occupyingLoc = GameBoard.getToBeOccupied(size, x, y, orientation);

  const [start] = occupyingLoc.slice(0, 1);
  const [end] = occupyingLoc.slice(-1);

  return [start, end];
}

function runBoardItem(e) {
  const activeShip = document.querySelector('.ship.active');

  if (!activeShip) return;

  const { shipSize, orientation, name } = activeShip.dataset;
  const current = e.currentTarget;
  const { x, y } = current.dataset;

  console.log({ x, y });
  console.log(current);
  console.log(activeShip);
  console.log(shipSize);

  let attached = [];

  switch (shipSize) {
    case '5':
      GAME_CONTROLLER.placeHumanPlayerCarrier(
        Number(x),
        Number(y),
        orientation,
      );

      attached = attachShipToBoard(
        GAME_CONTROLLER.humanPlayerShipDetails().carrierInfo,
        activeShip,
      );
      break;

    case '4':
      GAME_CONTROLLER.placeHumanPlayerBattleShip(
        Number(x),
        Number(y),
        orientation,
      );

      attached = attachShipToBoard(
        GAME_CONTROLLER.humanPlayerShipDetails().battleShipInfo,
        activeShip,
      );
      break;

    case '3':
      if (name === 'destroyer') {
        GAME_CONTROLLER.placeHumanPlayerDestroyer(
          Number(x),
          Number(y),
          orientation,
        );

        attached = attachShipToBoard(
          GAME_CONTROLLER.humanPlayerShipDetails().destroyerInfo,
          activeShip,
        );
      } else if (name === 'submarine') {
        GAME_CONTROLLER.placeHumanPlayerSubMarine(
          Number(x),
          Number(y),
          orientation,
        );
        attached = attachShipToBoard(
          GAME_CONTROLLER.humanPlayerShipDetails().submarineInfo,
          activeShip,
        );
      }

      break;

    case '2':
      GAME_CONTROLLER.placeHumanPlayerPatrolBoat(
        Number(x),
        Number(y),
        orientation,
      );

      attached = attachShipToBoard(
        GAME_CONTROLLER.humanPlayerShipDetails().patrolBoatInfo,
        activeShip,
      );

      break;

    default:
      break;
  }

  if (attached.length === 0) return;

  const [start, end] = attached;
  const [sx, sy] = start;
  const [ex, ey] = end;

  activeShip.style.gridArea = `X${sx}-Y${sy} / X${sx}-Y${sy} / X${ex}-Y${ey} / X${ex}-Y${ey}`;
}

const botShipSunk = [];
const humanShipSunk = [];

function processHumanShipSink(GAME__CONTROLLER, BOT_PLAYER_EL_STRUCTURE) {
  const botPlayerShipDetails = GAME__CONTROLLER.botPlayerShipDetails();

  const botShipsDetails = Object.values(botPlayerShipDetails);

  botShipsDetails.forEach((shipDetails) => {
    const { isSunk, name, neighborLoc } = shipDetails;

    if (isSunk && !botShipSunk.includes(name)) {
      botShipSunk.push(name);

      console.log(name);

      const shipEl = BOT_PLAYER_EL_STRUCTURE.botShipYard.querySelector(
        `.ship.${name}`,
      );
      shipEl.classList.add('sunk');
      neighborLoc.forEach((loc) => {
        const [x, y] = loc;

        const boardItem =
          BOT_PLAYER_EL_STRUCTURE.boardNodesContainer.querySelector(
            `.bot-player-board .board-item[data-x='${x}'][data-y='${y}']`,
          );

        console.log(boardItem);

        boardItem.dataset.hitStatus = 3;
      });
    }
  });
  const { roundWon } = GAME__CONTROLLER.roundState;

  if (roundWon) {
    openModal(ROUND_WIN_MODAL.roundWinDialog);
  }
}

function processBotShipSink(GAME__CONTROLLER, HUMAN_EL_STRUCTURE) {
  const humanPlayerShipDetails = GAME__CONTROLLER.humanPlayerShipDetails();

  const humanShipDetails = Object.values(humanPlayerShipDetails);

  humanShipDetails.forEach((shipDetails) => {
    const { name, neighborLoc, isSunk } = shipDetails;

    if (isSunk && !humanShipSunk.includes(name)) {
      humanShipSunk.push(name);
      neighborLoc.forEach((loc) => {
        const [x, y] = loc;

        const boardItem = HUMAN_EL_STRUCTURE.boardNodesContainer.querySelector(
          `.board-item[data-x='${x}'][data-y='${y}']`,
        );

        boardItem.dataset.hitStatus = 3;
      });
    }
  });
  const { roundWon } = GAME__CONTROLLER.roundState;

  if (roundWon) {
    // processRoundWin();

    openModal(ROUND_LOSS_MODAL.roundLossDialog);
    console.log('bot won');
  }
}

function placeShipOnPlayerBoard(
  playerElementStruct,
  placementShipsDetails,
  addMask = false,
) {
  const { boardNodesContainer, boardClassName } = playerElementStruct;

  const shipKeys = Object.keys(placementShipsDetails);

  shipKeys.forEach((key) => {
    const shipPlacement = placementShipsDetails[key];
    const { occupyingLoc } = shipPlacement;

    occupyingLoc.forEach((loc) => {
      const [x, y] = loc;

      const boardItem = boardNodesContainer.querySelector(
        `${boardClassName} .board-item[data-x='${x}'][data-y='${y}']`,
      );

      boardItem.dataset.hasShip = true;
      boardItem.dataset.mask = addMask;
    });
  });
}

function gamePlayScreenEventListeners(gamePlayScreen, gameController_) {
  const {
    turnMarkers,
    humanPlayerStructure,
    botPlayerStructure,
    homeIconContainer,
  } = gamePlayScreen;

  let { isHuman, isBot } = gameController_.getActivePlayer();
  const [turnMarkerEl, turnMarkerEl2] = turnMarkers;
  const botMoveStore = [];

  if (isHuman) {
    turnMarkerEl.dataset.turnIndicator = 'human';
    turnMarkerEl2.dataset.turnIndicator = 'human';
  }

  if (isBot) {
    turnMarkerEl.dataset.turnIndicator = 'bot';
    turnMarkerEl2.dataset.turnIndicator = 'bot';
  }

  const humanPlayerShipDetails = gameController_.humanPlayerShipDetails();
  const botPlayerShipDetails = gameController_.botPlayerShipDetails();

  console.log(humanPlayerShipDetails);
  console.log(botPlayerShipDetails);

  placeShipOnPlayerBoard(humanPlayerStructure, humanPlayerShipDetails);
  placeShipOnPlayerBoard(botPlayerStructure, botPlayerShipDetails, true);

  console.log(gameController_);

  botPlayerStructure.playerBoard.addEventListener('click', (e) => {
    const { target } = e;

    if (!target.classList.contains('board-item')) return;

    const { roundWon } = gameController_.roundState;

    if (roundWon) {
      // processRoundWin();
      console.log('round win');
      return;
    }

    if (Number(target.dataset.hitStatus) >= 0) return;

    // ({ isHuman, isBot } = gameController_.getActivePlayer());

    if (isHuman && botMoveStore.length === 0) {
      const { x, y } = target.dataset;
      const hitStatus = gameController_.humanPlayerMove(Number(x), Number(y));

      console.log(hitStatus);

      const boardItem = botPlayerStructure.boardNodesContainer.querySelector(
        `.board-item[data-x='${x}'][data-y='${y}']`,
      );

      boardItem.dataset.hitStatus = hitStatus;

      if (hitStatus === 2) {
        processHumanShipSink(gameController_, botPlayerStructure);
        console.log('ship sunk');
      }
    }

    ({ isBot, isHuman } = gameController_.getActivePlayer());

    if (isBot) {
      humanPlayerStructure.boardNodesContainer.scrollIntoView({
        block: 'center',
        inline: 'center',
        behavior: 'smooth',
      });

      do {
        const { move, hitStatus } = gameController_.computerPlayerMove;
        // const manualMoveX = Number(prompt('Choose x: '));
        // const manualMoveY = Number(prompt('Choose Y: '));

        // const status = gameController_.botMove(manualMoveX, manualMoveY);
        // const move = [manualMoveX, manualMoveY];
        turnMarkerEl.dataset.turnIndicator = 'bot';
        turnMarkerEl2.dataset.turnIndicator = 'bot';

        console.log('bot thinking');
        botMoveStore.push({ move, hitStatus });

        ({ isBot, isHuman } = gameController_.getActivePlayer());
      } while (isBot);

      botMoveStore.forEach((store, index) => {
        const { move, hitStatus } = store;
        setTimeout(
          () => {
            console.log(move, hitStatus);

            const [x, y] = move;
            const boardItem =
              humanPlayerStructure.boardNodesContainer.querySelector(
                `.board-item[data-x='${x}'][data-y='${y}']`,
              );

            boardItem.dataset.hitStatus = hitStatus;
            console.log(boardItem);
            console.log(botMoveStore);
            if (hitStatus === 2) {
              processBotShipSink(gameController_, humanPlayerStructure);
              console.log('ship sunk');
            }

            botMoveStore.shift();
            if (botMoveStore.length === 0) {
              turnMarkerEl.dataset.turnIndicator = 'human';
              turnMarkerEl2.dataset.turnIndicator = 'human';
              botPlayerStructure.boardNodesContainer.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'nearest',
              });
            }
          },
          1000 * (index + 1),
        );
      });
    }
  });

  homeIconContainer.addEventListener('click', () => {
    changeScreen(LOAD_SCREEN.loadingScreenContainer);
  });
}

function playSetupEventListeners(PlaySetupScreen) {
  const {
    homeBtn,
    rotateBtn,
    shipsElementArr,
    autoPositionBtn,
    boardNodesArray,
    startGameBtn,
  } = PlaySetupScreen;

  homeBtn.addEventListener('click', () => {
    changeScreen(HOME_PAGE_SCREEN.homePageContainer);
  });

  shipsElementArr.forEach((ship) => {
    ship.addEventListener('click', (e) => {
      const current = e.currentTarget;

      const { orientation } = current.dataset;

      shipsElementArr.forEach((s) => {
        if (s !== current) {
          s.classList.remove('active');
        }
      });

      if (orientation === 'horizontal') {
        rotateBtn.dataset.rotate = 'vertical';
      } else {
        rotateBtn.dataset.rotate = 'horizontal';
      }

      current.classList.toggle('active');
    });
  });

  autoPositionBtn.addEventListener('click', () => {
    GAME_CONTROLLER.autoPlaceHumanPlayerShips();
    const {
      carrierInfo,
      battleShipInfo,
      destroyerInfo,
      submarineInfo,
      patrolBoatInfo,
    } = GAME_CONTROLLER.humanPlayerShipDetails();

    {
      const { isOnBoard, shipHead, orientation } = carrierInfo;

      console.log(isOnBoard);
      const [x, y] = shipHead;

      const boardItem = document.querySelector(
        `[data-x='${x}'][data-y='${y}']`,
      );

      const ship = document.querySelector('.ship.carrier');

      ship.dataset.orientation = orientation;

      if (isOnBoard) {
        ship.classList.add('active');
        boardItem.click();
        ship.classList.remove('active');
      }
    }

    {
      const { isOnBoard, shipHead, orientation } = battleShipInfo;

      console.log(isOnBoard);
      const [x, y] = shipHead;

      const boardItem = document.querySelector(
        `[data-x='${x}'][data-y='${y}']`,
      );

      const ship = document.querySelector('.ship.battleship');

      ship.dataset.orientation = orientation;

      if (isOnBoard) {
        ship.classList.add('active');
        boardItem.click();
        ship.classList.remove('active');
      }
    }

    {
      const { isOnBoard, shipHead, orientation } = destroyerInfo;

      console.log(isOnBoard);
      const [x, y] = shipHead;

      const boardItem = document.querySelector(
        `[data-x='${x}'][data-y='${y}']`,
      );

      const ship = document.querySelector('.ship.destroyer');

      ship.dataset.orientation = orientation;

      if (isOnBoard) {
        ship.classList.add('active');
        boardItem.click();
        ship.classList.remove('active');
      }
    }

    {
      const { isOnBoard, shipHead, orientation } = submarineInfo;

      console.log(isOnBoard);
      const [x, y] = shipHead;

      const boardItem = document.querySelector(
        `[data-x='${x}'][data-y='${y}']`,
      );

      const ship = document.querySelector('.ship.submarine');

      ship.dataset.orientation = orientation;

      if (isOnBoard) {
        ship.classList.add('active');
        boardItem.click();
        ship.classList.remove('active');
      }
    }

    {
      const { isOnBoard, shipHead, orientation } = patrolBoatInfo;

      console.log(isOnBoard);
      const [x, y] = shipHead;

      const boardItem = document.querySelector(
        `[data-x='${x}'][data-y='${y}']`,
      );

      const ship = document.querySelector('.ship.patrol-boat');

      ship.dataset.orientation = orientation;

      if (isOnBoard) {
        ship.classList.add('active');
        boardItem.click();
        ship.classList.remove('active');
      }
    }
  });

  boardNodesArray.forEach((boardNode) => {
    boardNode.addEventListener('click', runBoardItem);
  });

  rotateBtn.addEventListener('click', () => {
    const { rotate } = PlaySetupScreen.rotateBtn.dataset;

    const activeShip = document.querySelector('.ship.active');

    if (!activeShip) {
      console.log('nut');
      return;
    }

    const { shipSize, name } = activeShip.dataset;

    let placed = false;
    let shipHead;
    let x;
    let y;

    switch (shipSize) {
      case '5':
        ({ shipHead } =
          GAME_CONTROLLER.humanPlayerShipDetails().carrierPlacement);

        [x, y] = shipHead;

        placed = GAME_CONTROLLER.placeHumanPlayerCarrier(
          Number(x),
          Number(y),
          rotate,
        );
        break;
      case '4':
        ({ shipHead } =
          GAME_CONTROLLER.humanPlayerShipDetails().battleShipPlacement);

        [x, y] = shipHead;

        placed = GAME_CONTROLLER.placeHumanPlayerBattleShip(
          Number(x),
          Number(y),
          rotate,
        );
        break;
      case '3':
        console.log(name);

        if (name === 'destroyer') {
          ({ shipHead } =
            GAME_CONTROLLER.humanPlayerShipDetails().destroyerPlacement);

          [x, y] = shipHead;
          placed = GAME_CONTROLLER.placeHumanPlayerDestroyer(
            Number(x),
            Number(y),
            rotate,
          );
        } else if (name === 'submarine') {
          ({ shipHead } =
            GAME_CONTROLLER.humanPlayerShipDetails().subMarinePlacement);

          [x, y] = shipHead;
          console.log(x, y, rotate);
          placed = GAME_CONTROLLER.placeHumanPlayerSubMarine(
            Number(x),
            Number(y),
            rotate,
          );
        }
        break;
      case '2':
        ({ shipHead } =
          GAME_CONTROLLER.humanPlayerShipDetails().patrolBoatPlacement);

        [x, y] = shipHead;

        placed = GAME_CONTROLLER.placeHumanPlayerPatrolBoat(
          Number(x),
          Number(y),
          rotate,
        );
        break;

      default:
        break;
    }

    console.log(placed);

    if (placed) {
      activeShip.dataset.orientation = rotate;

      const boardItem = document.querySelector(
        `[data-x='${x}'][data-y='${y}']`,
      );

      console.log(boardItem);

      boardItem.click();

      if (rotate === 'horizontal') {
        rotateBtn.dataset.rotate = 'vertical';
      } else {
        rotateBtn.dataset.rotate = 'horizontal';
      }
    } else {
      console.log('not placed');

      activeShip.classList.add('fail-place');

      setTimeout(() => {
        activeShip.classList.remove('fail-place');
      }, 800);
    }
  });

  startGameBtn.addEventListener('click', () => {
    const { roundState } = GAME_CONTROLLER;

    if (!roundState.canPlayRound) return;

    GAME_CONTROLLER.autoPlaceBotShips();

    GAME_PLAY_SCREEN = createGamePlayPage();
    gamePlayScreenEventListeners(GAME_PLAY_SCREEN, GAME_CONTROLLER);
    changeScreen(GAME_PLAY_SCREEN.gamePlayContainer);
  });
}

HOME_PAGE_SCREEN.playBtn.addEventListener('click', () => {
  PLAY_SETUP_SCREEN = createPlaySetupPage();
  changeScreen(PLAY_SETUP_SCREEN.gameSetupContainer);

  GAME_CONTROLLER.startRound();
  playSetupEventListeners(PLAY_SETUP_SCREEN);
});

HOME_PAGE_SCREEN.tutorialBtn.addEventListener('click', () => {
  changeScreen(TUTORIAL_PAGE_SCREEN.tutorialPageContainer);
});

function initialRender() {
  changeScreen(LOAD_SCREEN.loadingScreenContainer);

  LOAD_SCREEN.line.addEventListener('animationend', () => {
    LOAD_SCREEN.loadingScreenContainer.classList.add('loading-complete');
    changeScreen(HOME_PAGE_SCREEN.homePageContainer, 500);
    setTimeout(() => {
      LOAD_SCREEN.loadingScreenContainer.classList.remove('loading-complete');
    }, 650);
  });
}

initialRender();
