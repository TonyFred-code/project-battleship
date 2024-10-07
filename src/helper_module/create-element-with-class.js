export default function createElementWithClass(element, classNames) {
  const ELEMENT = document.createElement(element);

  if (classNames && classNames.length !== 0) {
    classNames.forEach((className) => {
      if (className) {
        ELEMENT.classList.add(className);
      }
    });
  }

  return ELEMENT;
}
