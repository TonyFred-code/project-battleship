import Ship from './ship';
import evaluateGuess from './evaluate-guess';

const hello = () => console.log('hello');

const array = ['a', 'b', 'c'];

const spread = [...array];

console.log(spread);

hello();

console.log(new Ship(2));

const MAGIC_NUMBER = Math.floor(Math.random() * 10);

function runGame() {
  const output = document.querySelector('output');
  const input = document.querySelector('input');
  const { value } = input;

  output.textContent = evaluateGuess(MAGIC_NUMBER, Number(value));
}

const submitBtn = document.querySelector('.submit');
submitBtn.addEventListener('click', runGame);
