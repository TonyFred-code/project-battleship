import createHomePage from '../home-page.js';
import playSetupWorker from './play-setup-worker.js';
import changeScreen from '../../helper_module/change-screen.js';

export function onClickPlayBtn(GAME_CONTROLLER) {
  const gamePlayContainer = playSetupWorker(GAME_CONTROLLER, onClickPlayBtn);

  changeScreen(gamePlayContainer);
}

export default function homePageWorker(GAME_CONTROLLER) {
  const { homePageContainer, playBtn } = createHomePage();

  playBtn.addEventListener('click', () => {
    onClickPlayBtn(GAME_CONTROLLER);
  });

  return homePageContainer;
}

export function changeToHomeScreen(GAME_CONTROLLER) {
  const homePageContainer = homePageWorker(GAME_CONTROLLER);

  changeScreen(homePageContainer);
}
