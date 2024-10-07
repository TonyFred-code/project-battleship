// import createPlaySetupPage from '../play-setup.js';

// // eslint-disable-next-line import/no-cycle
// import { changeToHomeScreen } from './home-page-worker.js';

// function runBoardItem(e, GAME_CONTROLLER, BOARD_NODES_CONTAINER) {
//   const activeShip = document.querySelector('.ship.active');

//   if (!activeShip) return;

//   const { shipSize, orientation, name } = activeShip.dataset;
//   let placementDetails;
//   const current = e.currentTarget;
//   const { x, y } = current.dataset;

//   console.log({ x, y });
//   console.log(current);
//   console.log(activeShip);
//   console.log(shipSize);

//   let placed = false;

//   switch (shipSize) {
//     case '5':
//       placed = GAME_CONTROLLER.placeHumanPlayerCarrier(
//         Number(x),
//         Number(y),
//         orientation,
//       );
//       placementDetails = GAME_CONTROLLER.humanPlayerCarrierPlacementDetails;
//       break;

//     case '4':
//       placed = GAME_CONTROLLER.placeHumanPlayerBattleShip(
//         Number(x),
//         Number(y),
//         orientation,
//       );
//       placementDetails = GAME_CONTROLLER.humanPlayerBattleShipPlacementDetails;
//       break;

//     case '3':
//       if (name === 'destroyer') {
//         placed = GAME_CONTROLLER.placeHumanPlayerDestroyer(
//           Number(x),
//           Number(y),
//           orientation,
//         );

//         placementDetails = GAME_CONTROLLER.humanPlayerDestroyerPlacementDetails;
//       } else if (name === 'submarine') {
//         placed = GAME_CONTROLLER.placeHumanPlayerSubMarine(
//           Number(x),
//           Number(y),
//           orientation,
//         );
//         placementDetails = GAME_CONTROLLER.humanPlayerSubMarinePlacementDetails;
//       }

//       break;

//     case '2':
//       placed = GAME_CONTROLLER.placeHumanPlayerPatrolBoat(
//         Number(x),
//         Number(y),
//         orientation,
//       );

//       placementDetails = GAME_CONTROLLER.humanPlayerPatrolBoatPlacementDetails;
//       break;

//     default:
//       break;
//   }

//   if (placed && placementDetails) {
//     BOARD_NODES_CONTAINER.appendChild(activeShip);
//     const { occupyingLoc } = placementDetails;

//     const [start] = occupyingLoc.slice(0, 1);
//     const [end] = occupyingLoc.slice(-1);

//     const [sx, sy] = start;
//     const [ex, ey] = end;
//     activeShip.style.gridArea = `X${sx}-Y${sy} / X${sx}-Y${sy} / X${ex}-Y${ey} / X${ex}-Y${ey}`;

//     console.log('placed');
//   } else {
//     console.log('not placed');

//     activeShip.classList.add('fail-place');

//     setTimeout(() => {
//       activeShip.classList.remove('fail-place');
//     }, 800);
//   }
// }

// function innerWorker(GAME_CONTROLLER, PLAY_SETUP_EL, onClickHomeBtn) {
//   const {
//     gameSetupContainer,
//     boardNodesArray,
//     homeBtn,
//     rotateBtn,
//     autoPositionBtn,
//     shipsElementArr,
//     startGameBtn,
//   } = PLAY_SETUP_EL;

//   homeBtn.addEventListener('click', changeToHomeScreen);
// }

// export default function playSetupWorker(GAME_CONTROLLER, onClickHomeBtn) {
//   const playSetup = createPlaySetupPage();

//   innerWorker(GAME_CONTROLLER, playSetup, onClickHomeBtn);

//   return playSetup.gameSetupContainer;
// }
