export default function changeScreen(incoming, delay = 100) {
  const content = document.querySelector('body');

  setTimeout(() => {
    content.innerHTML = '';
    content.appendChild(incoming);
  }, delay);
}
