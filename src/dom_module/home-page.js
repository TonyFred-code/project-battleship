import createElementWithClass from '../helper_module/create-element-with-class.js';

export default function createHomePage() {
  const homePageContainer = createElementWithClass('div', [
    'home-page',
    'centered_flex',
    'd-flex__col',
  ]);

  const genericContainer = createElementWithClass('div', [
    'container',
    'd-flex__col',
    'centered_flex',
  ]);

  const h1 = createElementWithClass('h1', ['home-page__title']);
  h1.textContent = 'battleship';

  const homePageBtnGroup = createElementWithClass('div', [
    'home-page__btn-group',
    'd-flex__col',
    'gap_10',
  ]);

  const playBtn = createElementWithClass('button', ['btn', 'play__btn']);
  playBtn.textContent = 'play';

  const settingsBtn = createElementWithClass('button', [
    'btn',
    'settings__btn',
  ]);

  settingsBtn.textContent = 'settings';

  homePageBtnGroup.appendChild(playBtn);
  homePageBtnGroup.appendChild(settingsBtn);

  const tutorialBtnContainer = createElementWithClass('div', [
    'tutorial-btn-container',
  ]);

  const tutorialBtn = createElementWithClass('button', [
    'btn',
    'tutorial__btn',
  ]);
  tutorialBtn.textContent = '?';

  tutorialBtnContainer.appendChild(tutorialBtn);

  genericContainer.appendChild(h1);
  genericContainer.appendChild(homePageBtnGroup);
  genericContainer.appendChild(tutorialBtnContainer);

  homePageContainer.appendChild(genericContainer);

  return homePageContainer;
}
