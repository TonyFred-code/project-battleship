import createElementWithClass from '../helper_module/create-element-with-class.js';

import HOME_IMG_SRC from '../images/home.svg';

export default function createRoundLossPage() {
  const roundLossDialog = createElementWithClass('dialog', [
    'round-loss-dialog',
    'd-flex__col',
    'align-items__center',
    'justify-content__center',
  ]);

  const genericContainer = createElementWithClass('div', [
    'dialog-content',
    'container',
    'd-flex__col',
    'align-items__center',
    'justify-content__center',
    'gap_2r',
  ]);

  const dialogHeader = createElementWithClass('h1', [
    'text-transform__capitalize',
    'dialog-header',
  ]);

  dialogHeader.textContent = 'YOU LOSE';

  const btnGroup = createElementWithClass('div', ['btn-group', 'd-flex__row']);

  const homeBtn = createElementWithClass('div', [
    'home-btn',
    'btn',
    'icon-container',
  ]);

  const homeBtnImg = createElementWithClass('img', ['img']);

  homeBtnImg.src = HOME_IMG_SRC;
  homeBtnImg.alt = '';

  homeBtn.appendChild(homeBtnImg);

  btnGroup.appendChild(homeBtn);

  genericContainer.appendChild(dialogHeader);
  genericContainer.appendChild(btnGroup);

  roundLossDialog.appendChild(genericContainer);

  return {
    roundLossDialog,
    homeBtn,
  };
}
