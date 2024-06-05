import Ship from './ship.js';
// import './dom_module/loading-screen.js';
import './style.css';
import createLoadScreen from './dom_module/loading-screen.js';

const content = document.querySelector('body');

const loadingScreenContainer = createLoadScreen();
content.appendChild(loadingScreenContainer);
const hello = () => console.log('hello');

const array = ['a', 'b', 'c'];

const spread = [...array];

console.log(spread);

hello();

console.log(new Ship(2));
