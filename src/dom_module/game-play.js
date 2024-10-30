import createElementWithClass from '../helper_module/create-element-with-class.js';
import { reverseTransform } from '../helper_module/number-transform.js';
import GAME_SETTINGS from '../GAME_SETTINGS/game-settings.js';

import ACCOUNT_ICON_SRC from '../images/account.svg';
import ROBOT_ICON_SRC from '../images/robot.svg';
// import SETTINGS_ICON_SRC from '../images/cog.svg';
import HOME_ICON_SRC from '../images/home.svg';

const { BOARD_SPECS } = GAME_SETTINGS;
const { BOARD_X_SIZE } = BOARD_SPECS;

const shipsDetails = [
  {
    classNames: ['ship', 'z_index_2', 'd-flex', 'battleship', 'gap_2'],
    shipSize: 4,
    orientation: 'horizontal',
    sunk: false,
    name: 'battleship',
  },

  {
    classNames: ['ship', 'z_index_2', 'd-flex', 'gap_2', 'destroyer'],
    shipSize: 3,
    orientation: 'horizontal',
    sunk: false,
    name: 'destroyer',
  },
  {
    classNames: ['ship', 'z_index_2', 'd-flex', 'patrol_boat', 'gap_2'],
    shipSize: 2,
    orientation: 'horizontal',
    sunk: false,
    name: 'patrol_boat',
  },

  {
    classNames: ['ship', 'z_index_2', 'd-flex', 'submarine', 'gap_2'],
    shipSize: 3,
    orientation: 'horizontal',
    sunk: false,
    name: 'submarine',
  },

  {
    classNames: ['ship', 'z_index_2', 'd-flex', 'gap_2', 'carrier'],
    shipSize: 5,
    orientation: 'horizontal',
    sunk: false,
    name: 'carrier',
  },
];

function buildPlayerStructure({
  boardNodesContainer,
  rowLabelContainer,
  colLabelContainer,
  boardNodeClassNames,
}) {
  for (let i = 0; i < BOARD_X_SIZE * BOARD_X_SIZE; i += 1) {
    const boardNode = createElementWithClass('button', boardNodeClassNames);
    const [x, y] = reverseTransform(i, BOARD_X_SIZE);
    boardNode.dataset.x = x;
    boardNode.dataset.y = y;
    boardNode.dataset.hasShip = false;
    boardNode.dataset.mask = false;
    boardNode.dataset.hitStatus = -1;
    boardNode.style.gridArea = `X${x}-Y${y}`;

    boardNodesContainer.appendChild(boardNode);
  }

  for (let i = 0; i < BOARD_X_SIZE; i += 1) {
    const colLabelItem = document.createElement('div');
    const rowLabelItem = document.createElement('div');

    rowLabelItem.classList.add('label-item', 'centered_flex', 'd-flex-row');
    colLabelItem.classList.add('label-item', 'centered_flex', 'd-flex-col');

    const rowTextContent = String.fromCharCode(i + 65);
    const colTextContent = `${i + 1}`;

    rowLabelItem.textContent = rowTextContent;
    colLabelItem.textContent = colTextContent;

    rowLabelContainer.appendChild(rowLabelItem);
    colLabelContainer.appendChild(colLabelItem);
  }
}

export default function createGamePlayPage() {
  const gamePlayContainer = createElementWithClass('div', [
    'game-play-container',
    'd-flex__col',
    'centered_flex',
    'text-align__center',
  ]);

  const genericContainer = createElementWithClass('div', [
    'container',
    'centered_flex',
    'd-flex__col',
    'gap_2r',
    'padding_2r',
  ]);

  const humanPlayerSecContainer = createElementWithClass('div', [
    'human-player-section-container',
  ]);

  const verticalDividerContainer = createElementWithClass('div', [
    'vertical-divider-container',
  ]);

  const botPlayerSecContainer = createElementWithClass('div', [
    'bot-player-section-container',
  ]);

  const smallScreenDivider = createElementWithClass('div', [
    'hidden_mid',
    'small-screen_divider',
    'horizontal-divider-container',
  ]);

  const verticalDivider1 = createElementWithClass('div', ['vertical-divider']);
  const turnMarkerEl = createElementWithClass('div', ['turn-marker']);
  turnMarkerEl.dataset.turnIndicator = 'human';
  const verticalDivider2 = createElementWithClass('div', ['vertical-divider']);

  const horizontalDivider1 = createElementWithClass('div', [
    'horizontal-divider',
  ]);
  const turnMarkerEl2 = createElementWithClass('div', ['turn-marker']);
  turnMarkerEl.dataset.turnIndicator = 'human';
  const horizontalDivider2 = createElementWithClass('div', [
    'horizontal-divider',
  ]);

  const genericDiv = createElementWithClass('div');

  const humanWaterHeader = createElementWithClass('h1', [
    'water-header',
    'text-transform__lowercase',
  ]);

  humanWaterHeader.textContent = 'Your Waters';

  const humanPlayerBoard = createElementWithClass('div', [
    'board',
    'human-player-board',
  ]);

  const humanRowLabel = createElementWithClass('div', [
    'row-label',
    'gap_2',
    'centered_flex',
    'text-transform__uppercase',
  ]);

  const humanColLabel = createElementWithClass('div', [
    'col-label',
    'gap_2',
    'centered_flex',
    'text-transform__uppercase',
  ]);

  const humanBoardNodesContainer = createElementWithClass('div', [
    'board-item-container',
    'gap_2',
  ]);

  humanPlayerBoard.appendChild(humanRowLabel);
  humanPlayerBoard.appendChild(humanColLabel);
  humanPlayerBoard.appendChild(humanBoardNodesContainer);

  genericDiv.appendChild(humanWaterHeader);
  genericDiv.appendChild(humanPlayerBoard);

  const horizontalDividerContainer1 = createElementWithClass('div', [
    'horizontal-divider-container',
  ]);

  const horizontalDivider3 = createElementWithClass('div', [
    'horizontal-divider',
  ]);

  horizontalDividerContainer1.appendChild(horizontalDivider3);

  const genericDiv2 = createElementWithClass('div', [
    'd-flex',
    'align-items__center',
    'justify-content__center',
  ]);

  const gameDashBoardContainer = createElementWithClass('div', [
    'game-dashboard-container',
  ]);

  const playerDescContainer = createElementWithClass('div', [
    'players-desc-container',
  ]);

  const accountIconContainer = createElementWithClass('button', [
    'icon_container',
    'btn',
  ]);

  const accountIconImg = createElementWithClass('img', ['img']);
  accountIconImg.src = ACCOUNT_ICON_SRC;
  accountIconImg.alt = '';

  accountIconContainer.appendChild(accountIconImg);

  const pTag1 = createElementWithClass('p', ['text-transform__lowercase']);
  pTag1.textContent = 'vs';

  const robotIconContainer = createElementWithClass('button', [
    'btn',
    'icon_container',
  ]);

  const robotIconImg = createElementWithClass('img', ['img']);
  robotIconImg.src = ROBOT_ICON_SRC;
  robotIconImg.alt = '';

  robotIconContainer.appendChild(robotIconImg);

  const verticalDividerContainer2 = createElementWithClass('div', [
    'vertical-divider-container',
  ]);

  const verticalDivider3 = createElementWithClass('div', ['vertical-divider']);

  const gameControlsContainer = createElementWithClass('div', [
    'game-controls',
    'btn-group-container',
  ]);

  // const settingsIconContainer = createElementWithClass('button', [
  //   'btn',
  //   'settings-btn',
  //   'icon_container',
  //   'cursor_pointer',
  // ]);

  // const settingsIconImg = createElementWithClass('img', ['img']);

  // settingsIconImg.src = SETTINGS_ICON_SRC;
  // settingsIconImg.alt = '';

  const homeIconContainer = createElementWithClass('button', [
    'btn',
    'home-btn',
    'icon_container',
    'cursor_pointer',
  ]);

  const homeIconImg = createElementWithClass('img', ['img']);

  homeIconImg.src = HOME_ICON_SRC;
  homeIconImg.alt = '';

  const genericDiv3 = createElementWithClass('div');

  const botWaterHeader = createElementWithClass('h1', ['water-header']);

  botWaterHeader.textContent = 'enemy waters';

  const botPlayerBoard = createElementWithClass('div', [
    'board',
    'bot-player-board',
  ]);

  const botRowLabelEl = createElementWithClass('div', [
    'row-label',
    'gap_2',
    'centered_flex',
    'text-transform__uppercase',
  ]);

  const botColLabelEl = createElementWithClass('div', [
    'col-label',
    'gap_2',
    'centered_flex',
    'text-transform__uppercase',
  ]);

  const botBoardNodesContainer = createElementWithClass('div', [
    'board-item-container',
    'gap_2',
  ]);

  const horizontalDividerContainer2 = createElementWithClass('div', [
    'horizontal-divider-container',
  ]);

  const horizontalDivider4 = createElementWithClass('div', [
    'horizontal-divider',
  ]);

  const genericDiv4 = createElementWithClass('div', [
    'd-flex__col',
    'justify-content__center',
    'align-items__center',
  ]);

  const shipYardSecHeader = createElementWithClass('h2', [
    'ship-yard-section-header',
  ]);

  shipYardSecHeader.textContent = 'enemy shipyard';

  const shipYardContainer = createElementWithClass('div', [
    'bot-ship-yard-container',
    'd-flex__row',
    'justify-content__center',
  ]);

  botPlayerBoard.appendChild(botRowLabelEl);
  botPlayerBoard.appendChild(botColLabelEl);
  botPlayerBoard.appendChild(botBoardNodesContainer);

  genericDiv3.appendChild(botWaterHeader);
  genericDiv3.appendChild(botPlayerBoard);

  genericDiv4.appendChild(shipYardSecHeader);
  genericDiv4.appendChild(shipYardContainer);

  horizontalDividerContainer2.appendChild(horizontalDivider4);

  homeIconContainer.appendChild(homeIconImg);
  // settingsIconContainer.appendChild(settingsIconImg);

  // gameControlsContainer.appendChild(settingsIconContainer);
  gameControlsContainer.appendChild(homeIconContainer);

  verticalDividerContainer2.appendChild(verticalDivider3);

  playerDescContainer.appendChild(accountIconContainer);
  playerDescContainer.appendChild(pTag1);
  playerDescContainer.appendChild(robotIconContainer);

  gameDashBoardContainer.appendChild(playerDescContainer);
  gameDashBoardContainer.appendChild(verticalDividerContainer2);
  gameDashBoardContainer.appendChild(gameControlsContainer);

  genericDiv2.appendChild(gameDashBoardContainer);

  humanPlayerSecContainer.appendChild(genericDiv);
  humanPlayerSecContainer.appendChild(horizontalDividerContainer1);
  humanPlayerSecContainer.appendChild(genericDiv2);

  verticalDividerContainer.appendChild(verticalDivider1);
  verticalDividerContainer.appendChild(turnMarkerEl);
  verticalDividerContainer.appendChild(verticalDivider2);

  smallScreenDivider.appendChild(horizontalDivider1);
  smallScreenDivider.appendChild(turnMarkerEl2);
  smallScreenDivider.appendChild(horizontalDivider2);

  botPlayerSecContainer.appendChild(genericDiv3);
  botPlayerSecContainer.appendChild(horizontalDividerContainer2);
  botPlayerSecContainer.appendChild(genericDiv4);

  genericContainer.appendChild(humanPlayerSecContainer);
  genericContainer.appendChild(verticalDividerContainer);
  genericContainer.appendChild(botPlayerSecContainer);
  genericContainer.appendChild(smallScreenDivider);

  gamePlayContainer.appendChild(genericContainer);

  const humanPlayerStructure = {
    boardNodesContainer: humanBoardNodesContainer,
    rowLabelContainer: humanRowLabel,
    colLabelContainer: humanColLabel,
    playerBoard: humanPlayerBoard,
    boardClassName: '.human-player-board',
    boardNodeClassNames: ['board-item'],
  };

  const botPlayerStructure = {
    boardNodesContainer: botBoardNodesContainer,
    rowLabelContainer: botRowLabelEl,
    colLabelContainer: botColLabelEl,
    playerBoard: botPlayerBoard,
    boardClassName: '.bot-player-board',
    botShipYard: shipYardContainer,
    boardNodeClassNames: ['board-item', 'cursor_crosshair'],
  };

  buildPlayerStructure(humanPlayerStructure);
  buildPlayerStructure(botPlayerStructure);

  shipsDetails.forEach((shipDetails) => {
    const { classNames, orientation, sunk, shipSize, name } = shipDetails;

    const shipContainer = document.createElement('div');
    shipContainer.classList.add(...classNames);
    shipContainer.dataset.sunk = sunk;
    shipContainer.dataset.orientation = orientation;
    shipContainer.dataset.name = name;
    shipContainer.dataset.shipSize = shipSize;

    for (let i = 0; i < shipSize; i += 1) {
      const shipNode = document.createElement('div');
      shipNode.classList.add('ship-node');
      shipContainer.appendChild(shipNode);
    }

    shipYardContainer.appendChild(shipContainer);
  });

  const turnMarkers = [turnMarkerEl, turnMarkerEl2];

  return {
    gamePlayContainer,
    turnMarkers,
    botPlayerStructure,
    humanPlayerStructure,
    homeIconContainer,
  };
}
