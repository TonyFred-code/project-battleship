import createElementWithClass from '../helper_module/create-element-with-class.js';

export default function createLoadScreen() {
  const loadingScreenContainer = createElementWithClass('div', [
    'loading-screen',
    'd-flex__row',
    'centered_flex',
  ]);

  const genericContainer = createElementWithClass('div', [
    'container',
    'd-flex__col',
    'gap_2r',
    'padding_2r',
  ]);

  const loadingTitleContainer = createElementWithClass('div', [
    'loading-title',
    'text-align__center',
    'd-flex__col',
    'gap_10',
  ]);

  const h1 = createElementWithClass('h1', ['text-transform__capitalize']);
  h1.textContent = 'A Classic Board Game';

  const h2 = createElementWithClass('h2', ['text-transform__capitalize']);
  h2.textContent = 'Sea Battle';

  loadingTitleContainer.appendChild(h1);
  loadingTitleContainer.appendChild(h2);

  const loaderCompContainer = createElementWithClass('div', [
    'loader-container',
    'd-flex__col',
    'gap_10',
  ]);

  const loaderBar = createElementWithClass('div', [
    'loading-bar',
    'd-flex__col',
  ]);

  const loadingLine = createElementWithClass('div', ['loading-line']);

  const line = createElementWithClass('div', ['line']);

  loadingLine.appendChild(line);
  loaderBar.appendChild(loadingLine);

  const loadingText = createElementWithClass('div', ['loading-text']);

  const h3 = createElementWithClass('h3');
  const loader = createElementWithClass('div', ['loader']);

  h3.textContent = 'Loading';
  h3.appendChild(loader);

  loadingText.appendChild(h3);

  loaderCompContainer.appendChild(loaderBar);
  loaderCompContainer.appendChild(loadingText);

  genericContainer.appendChild(loadingTitleContainer);
  genericContainer.appendChild(loaderCompContainer);

  loadingScreenContainer.appendChild(genericContainer);

  return { loadingScreenContainer, line };
}
