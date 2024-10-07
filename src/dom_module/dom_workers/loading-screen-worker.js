// import changeScreen from '../../helper_module/change-screen.js';
// import createLoadScreen from '../loading-screen.js';
// import createHomePage from '../home-page.js';

// function addEventListenerToPlayBtn(playBtn, GAME_CONTROLLER) {

// }

// function onLoadEnd(GAME_CONTROLLER) {
//   const { homePageContainer, playBtn } = createHomePage();

//   addEventListenerToPlayBtn(playBtn, GAME_CONTROLLER);
//   changeScreen(homePageContainer, 350);
// }

// export default function loadingScreenWorker(GAME_CONTROLLER) {
//   const { loadingScreenContainer, line } = createLoadScreen();

//   changeScreen(loadingScreenContainer, 0);

//   line.addEventListener('animationend', () => {
//     loadingScreenContainer.classList.add('loading-complete');
//     setTimeout(() => {
//       onLoadEnd(GAME_CONTROLLER);
//     }, 300);
//   });

//   return loadingScreenContainer;
// }
