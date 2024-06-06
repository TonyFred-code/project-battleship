import createLoadScreen from './dom_module/loading-screen.js';
import createHomePage from './dom_module/home-page.js';
import './style.css';

function changeScreen(incoming, delay) {
  const content = document.querySelector('body');

  setTimeout(() => {
    content.innerHTML = '';
    content.appendChild(incoming);
  }, delay);
}

function renderInitialScreen() {
  const content = document.querySelector('body');

  const homePageContainer = createHomePage();
  const { loadingScreenContainer, line } = createLoadScreen();
  content.appendChild(loadingScreenContainer);

  line.addEventListener('animationend', () => {
    changeScreen(homePageContainer, 350);
  });
}

renderInitialScreen();
