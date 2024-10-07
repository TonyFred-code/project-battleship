import createElementWithClass from '../helper_module/create-element-with-class.js';
import { reverseTransform } from '../helper_module/number-transform.js';

import ROTATE_IMG_SRC from '../images/phone-rotate-landscape.svg';
import HOME_IMG_SRC from '../images/home.svg';

export default function createPlaySetupPage() {
  const BOARD_SIZE = 10;
  const rowSize = 10;
  const colSize = 10;
  const BOARD_NODES_COUNT = rowSize * colSize;

  const gameSetupContainer = createElementWithClass('div', [
    'game-setup',
    'd-flex__col',
    'centered_flex',
  ]);

  const genericContainer = createElementWithClass('div', [
    'container',
    'd-flex__col',
    'gap_2r',
    'centered_flex',
  ]);

  const boardContainer = createElementWithClass('div', ['board']);
  const boardNodesContainer = createElementWithClass('div', [
    'board-item-container',
    'gap_2',
  ]);
  const boardNodesArray = [];

  for (let i = 0; i < BOARD_NODES_COUNT; i += 1) {
    const boardItem = createElementWithClass('button', [
      'board-item',
      'cursor_pointer',
    ]);

    const [x, y] = reverseTransform(i, BOARD_SIZE);
    boardItem.dataset.x = x;
    boardItem.dataset.y = y;
    boardItem.style.gridArea = `X${x}-Y${y}`;
    boardNodesContainer.appendChild(boardItem);
    boardNodesArray.push(boardItem);
  }

  const rowLabel = createElementWithClass('div', [
    'row-label',
    'gap_2',
    'text-transform__uppercase',
  ]);
  const colLabel = createElementWithClass('div', [
    'col-label',
    'gap_2',
    'text-transform__uppercase',
  ]);

  const labelItemsDetails = [
    {
      category: 'rowLabel',
      itemsCount: rowSize,
      classNames: ['label-item', 'centered_flex', 'd-flex__row'],
      createdItemsCount: 0,
    },
    {
      category: 'colLabel',
      itemsCount: colSize,
      classNames: ['label-item', 'centered_flex', 'd-flex__col'],
      createdItemsCount: 0,
    },
  ];

  labelItemsDetails.forEach((labelItemDetails) => {
    const { category, itemsCount, classNames } = labelItemDetails;
    let { createdItemsCount } = labelItemDetails;

    while (createdItemsCount < itemsCount) {
      const labelItem = createElementWithClass('div', [...classNames]);
      let textContent = '';

      if (category === 'rowLabel') {
        textContent = String.fromCharCode(createdItemsCount + 65);
        labelItem.textContent = textContent;
        rowLabel.appendChild(labelItem);
      }

      if (category === 'colLabel') {
        textContent = `${createdItemsCount + 1}`;
        labelItem.textContent = textContent;
        colLabel.appendChild(labelItem);
      }

      createdItemsCount += 1;
    }
  });

  boardContainer.appendChild(rowLabel);
  boardContainer.appendChild(colLabel);
  boardContainer.appendChild(boardNodesContainer);

  const shipsDetails = [
    {
      classNames: [
        'ship',
        'z_index_2',
        'd-flex__col',
        'cursor_pointer',
        'gap_2',
        'carrier',
      ],
      shipSize: 5,
      orientation: 'vertical',
      active: false,
      name: 'carrier',
    },

    {
      classNames: [
        'ship',
        'z_index_2',
        'd-flex__col',
        'cursor_pointer',
        'battleship',
        'gap_2',
      ],
      shipSize: 4,
      orientation: 'vertical',
      active: false,
      name: 'battleship',
    },

    {
      classNames: [
        'ship',
        'z_index_2',
        'd-flex__col',
        'cursor_pointer',
        'gap_2',
        'destroyer',
      ],
      shipSize: 3,
      orientation: 'vertical',
      active: false,
      name: 'destroyer',
    },

    {
      classNames: [
        'ship',
        'z_index_2',
        'd-flex__col',
        'cursor_pointer',
        'submarine',
        'gap_2',
      ],
      shipSize: 3,
      orientation: 'vertical',
      active: false,
      name: 'submarine',
    },

    {
      classNames: [
        'ship',
        'z_index_2',
        'd-flex__col',
        'cursor_pointer',
        'patrol-boat',
        'gap_2',
      ],
      shipSize: 2,
      orientation: 'vertical',
      active: false,
      name: 'patrol_boat',
    },
  ];

  const shipBtnGroupContainer = createElementWithClass('div', [
    'ship-yard-btn-group-container',
    'd-flex__col',
    'gap_2r',
    'justify-content__space-around',
  ]);

  const shipsContainer = createElementWithClass('div', [
    'ship-yard',
    'd-flex__row',
    'gap_10',
  ]);

  const shipsElementArr = [];

  shipsDetails.forEach((shipDetails) => {
    const { classNames, orientation, active, shipSize, name } = shipDetails;

    const shipContainer = createElementWithClass('div', [...classNames]);
    shipContainer.dataset.active = active;
    shipContainer.dataset.orientation = orientation;
    shipContainer.dataset.name = name;
    shipContainer.dataset.shipSize = shipSize;

    for (let i = 0; i < shipSize; i += 1) {
      const shipNode = createElementWithClass('div', ['ship-node']);
      shipContainer.appendChild(shipNode);
    }

    shipsContainer.appendChild(shipContainer);
    shipsElementArr.push(shipContainer);
  });

  const btnGroupContainer = createElementWithClass('div', [
    'btn-group',
    'd-flex__row',
    'gap_10',
  ]);

  const rotateBtnImg = createElementWithClass('img');
  rotateBtnImg.src = ROTATE_IMG_SRC;
  rotateBtnImg.alt = 'Rotate Image';

  const rotateBtn = createElementWithClass('button', [
    'btn',
    'text-transform__lowercase',
    'cursor_pointer',
    'icon_container',
    'rotate',
  ]);
  rotateBtn.dataset.rotate = 'horizontal';

  rotateBtn.appendChild(rotateBtnImg);

  const autoPositionBtn = createElementWithClass('button', [
    'btn',
    'text-transform__lowercase',
    'cursor_pointer',
    'auto-position',
  ]);
  autoPositionBtn.textContent = 'auto';

  const startGameBtn = createElementWithClass('button', [
    'btn',
    'text-transform__lowercase',
    'cursor_pointer',
    'start-game',
  ]);

  startGameBtn.textContent = 'start';

  btnGroupContainer.appendChild(rotateBtn);
  btnGroupContainer.appendChild(autoPositionBtn);
  btnGroupContainer.appendChild(startGameBtn);

  shipBtnGroupContainer.appendChild(shipsContainer);
  shipBtnGroupContainer.appendChild(btnGroupContainer);

  const homeBtnContainer = createElementWithClass('div', [
    'home-btn-container',
  ]);

  const homeImg = createElementWithClass('img', ['img']);
  homeImg.src = HOME_IMG_SRC;
  homeImg.alt = 'Home Icon';

  const homeBtn = createElementWithClass('button', [
    'btn',
    'text-transform__lowercase',
    'icon_container',
    'home_btn',
    'cursor_pointer',
  ]);

  homeBtn.appendChild(homeImg);
  homeBtnContainer.appendChild(homeBtn);

  genericContainer.appendChild(boardContainer);
  genericContainer.appendChild(shipBtnGroupContainer);
  genericContainer.appendChild(homeBtnContainer);

  gameSetupContainer.appendChild(genericContainer);

  return {
    gameSetupContainer,
    homeBtn,
    shipsElementArr,
    boardNodesArray,
    boardNodesContainer,
    rotateBtn,
    startGameBtn,
    autoPositionBtn,
  };
}
