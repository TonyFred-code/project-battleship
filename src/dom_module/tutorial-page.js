import createElementWithClass from '../helper_module/create-element-with-class.js';
import HOME_ICON_SRC from '../images/home.svg';

export default function createTutorialPage() {
  const tutorialPageContainer = createElementWithClass('div', [
    'tutorial-page',
    'd-flex__col',
    'centered_flex',
  ]);

  const genericContainer = createElementWithClass('div', [
    'container',
    'd-flex__col',
    'padding_2r',
    'gap_1r',
  ]);

  const pageHeaderContainer = createElementWithClass('div', [
    'd-flex__row',
    'align-items__center',
    'justify-content__space-around',
  ]);

  const pageHeader = createElementWithClass('h1', [
    'text-align__center',
    'text-transform__capitalize',
  ]);

  pageHeader.textContent = 'how to play';

  const tutorialContentContainer = createElementWithClass('div', [
    'd-flex__col',
  ]);

  const homeBtn = createElementWithClass('button', [
    'btn',
    'icon_container',
    'd-flex__col',
    'centered_flex',
    'cursor_pointer',
  ]);

  const homeImg = createElementWithClass('img', ['img']);

  homeImg.src = HOME_ICON_SRC;
  homeImg.alt = '';

  homeBtn.appendChild(homeImg);

  pageHeaderContainer.appendChild(pageHeader);
  pageHeaderContainer.appendChild(homeBtn);

  genericContainer.appendChild(pageHeaderContainer);

  tutorialPageContainer.appendChild(genericContainer);

  return { tutorialPageContainer, homeBtn };
}
