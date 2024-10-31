import createElementWithClass from '../helper_module/create-element-with-class.js';

import TUTORIAL_ICON_SRC from '../images/help.svg';

export default function createHomePage() {
  const homePageContainer = createElementWithClass('div', [
    'home-page',
    'centered_flex',
    'd-flex__col',
    'text-align__center',
    'text-transform__uppercase',
  ]);

  const genericContainer = createElementWithClass('div', [
    'container',
    'd-flex__col',
    'centered_flex',
    'gap_2r',
  ]);

  const h1 = createElementWithClass('h1', [
    'home-page__title',
    'text-transform__capitalize',
  ]);
  h1.textContent = 'Sea Battle';

  const homePageBtnGroup = createElementWithClass('div', [
    'home-page__btn-group',
    'd-flex__col',
    'gap_10',
  ]);

  const playBtn = createElementWithClass('button', [
    'btn',
    'play__btn',
    'cursor_pointer',
    'text-transform__capitalize',
  ]);
  playBtn.textContent = 'play';

  // const settingsBtn = createElementWithClass('button', [
  //   'btn',
  //   'settings__btn',
  //   'cursor_pointer',
  //   'text-transform__capitalize',
  // ]);

  // settingsBtn.textContent = 'settings';

  homePageBtnGroup.appendChild(playBtn);
  // homePageBtnGroup.appendChild(settingsBtn);

  const tutorialBtnContainer = createElementWithClass('div', [
    'tutorial-btn-container',
  ]);

  const tutorialBtn = createElementWithClass('button', [
    'btn',
    'cursor_pointer',
    'icon_container',
  ]);

  const tutorialImg = createElementWithClass('img', ['img']);
  tutorialImg.src = TUTORIAL_ICON_SRC;
  tutorialImg.alt = '';

  tutorialBtn.appendChild(tutorialImg);
  tutorialBtnContainer.appendChild(tutorialBtn);

  genericContainer.appendChild(h1);
  genericContainer.appendChild(homePageBtnGroup);
  genericContainer.appendChild(tutorialBtnContainer);

  homePageContainer.appendChild(genericContainer);

  return { homePageContainer, playBtn, tutorialBtn };
}
