export default function getRndElement(array) {
  const rnd = Math.floor(Math.random() * array.length);
  const element = array[rnd];

  return {
    element,
    index: rnd,
  };
}
