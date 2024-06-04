import Ship from './ship.js';
import './style.css';

const hello = () => console.log('hello');

const array = ['a', 'b', 'c'];

const spread = [...array];

console.log(spread);

hello();

console.log(new Ship(2));
