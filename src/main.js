const Ship = require('./ship');

const hello = () => console.log('hello');

const array = ['a', 'b', 'c'];

const spread = [...array];

console.log(spread);

hello();

console.log(new Ship(2));
