import createElementWithClass from '../helper_module/create-element-with-class.js';

export default function createSettingsPage() {
  const settingsPageContainer = createElementWithClass('div', [
    'settings-page',
    'd-flex__col',
    'centered_flex',
  ]);

  const genericContainer = createElementWithClass('div', [
    'container',
    'd-flex__col',
    'padding_2r',
    'gap_1r',
  ]);

  const settingsForm = createElementWithClass('form', [
    'settings-form',
    'd-flex__col',
    'gap_2r',
  ]);

  const formSettingsHeader = createElementWithClass('h1', [
    'text-transform__uppercase',
    'form-settings-header',
  ]);

  formSettingsHeader.textContent = 'settings';

  const audioControllerContainer = createElementWithClass('div', [
    'audio-controls-section',
  ]);

  const horizontalDividerContainer1 = createElementWithClass('div', [
    'horizontal-divider-container',
    'd-flex__row',
    'align-items__center',
    'justify-content__center',
    'gap_10',
  ]);

  const horizontalDivider1 = createElementWithClass('div', [
    'horizontal-divider',
  ]);

  const audioControlsHeader = createElementWithClass('h2', [
    'text-transform__capitalize',
    'audio-section-header',
    'text-align__center',
  ]);

  audioControlsHeader.innerHTML = 'sound &amp; effect';

  const horizontalDivider2 = createElementWithClass('div', [
    'horizontal-divider',
  ]);

  const genericDiv1 = createElementWithClass('div', [
    'd-flex__col',
    'gap_5',
    'padding_2r',
  ]);

  const formRow1 = createElementWithClass('div', ['form-row']);

  const labelEl1 = createElementWithClass('label', ['d-flex__row', 'gap_5']);

  const volumeCheckBox = createElementWithClass('input');
  volumeCheckBox.id = 'volume';
  volumeCheckBox.name = 'volume';
  volumeCheckBox.type = 'checkbox';

  const span1 = createElementWithClass('span', ['text-transform__capitalize']);
  span1.textContent = 'background music';

  const formRow2 = createElementWithClass('div', ['form-row']);

  const labelEl2 = createElementWithClass('label', ['d-flex__row', 'gap_5']);

  const sfxCheckBox = createElementWithClass('input');
  sfxCheckBox.id = 'sfx';
  sfxCheckBox.name = 'sfx';
  sfxCheckBox.type = 'checkbox';

  const span2 = createElementWithClass('span', ['text-transform__capitalize']);
  span2.textContent = 'sound effects';

  const botDifficultySec = createElementWithClass('section', [
    'bot-difficulty-sec',
  ]);

  const horizontalDividerContainer2 = createElementWithClass('div', [
    'horizontal-divider-container',
    'd-flex__row',
    'align-items__center',
    'justify-content__center',
    'gap_10',
  ]);

  const horizontalDivider3 = createElementWithClass('div', [
    'horizontal-divider',
  ]);

  const botDifficultySecHeader = createElementWithClass('h2', [
    'bot-difficulty-sec-header',
    'text-transform__capitalize',
    'text-align__center',
  ]);
  botDifficultySecHeader.textContent = 'bot difficulty';

  const horizontalDivider4 = createElementWithClass('div', [
    'horizontal-divider',
  ]);

  const genericDiv2 = createElementWithClass('div', [
    'd-flex__col',
    'padding_2r',
  ]);

  const formRow3 = createElementWithClass('div', ['form-row']);

  const labelEl3 = createElementWithClass('label', ['d-flex__row', 'gap_5']);
  labelEl3.for = 'easy-bot-difficulty';

  const easyBotDiff = createElementWithClass('input');
  easyBotDiff.type = 'radio';
  easyBotDiff.name = 'bot-difficulty';
  easyBotDiff.id = 'easy-bot-difficulty';
  easyBotDiff.value = 'easy';

  const span3 = createElementWithClass('span', ['text-transform__capitalize']);
  span3.textContent = 'easy';

  const formRow4 = createElementWithClass('div', ['form-row']);

  const labelEl4 = createElementWithClass('label', ['d-flex__row', 'gap_5']);
  labelEl4.for = 'hard-bot-difficulty';

  const hardBotDiff = createElementWithClass('input');
  hardBotDiff.type = 'radio';
  hardBotDiff.name = 'bot-difficulty';
  hardBotDiff.id = 'hard-bot-difficulty';
  hardBotDiff.value = 'hard';

  const span4 = createElementWithClass('span', ['text-transform__capitalize']);
  span4.textContent = 'hard';

  const submitSec = createElementWithClass('div', [
    'submit-sec',
    'd-flex__col',
    'justify-content__center',
    'align-items__center',
  ]);

  const submitBtn = createElementWithClass('button', [
    'submit-form-settings',
    'btn',
    'padding_10',
    'text-transform__capitalize',
  ]);
  submitBtn.textContent = 'save settings';
  submitBtn.type = 'submit';

  submitSec.appendChild(submitBtn);

  horizontalDividerContainer2.appendChild(horizontalDivider3);
  horizontalDividerContainer2.appendChild(botDifficultySecHeader);
  horizontalDividerContainer2.appendChild(horizontalDivider4);

  labelEl3.appendChild(easyBotDiff);
  labelEl3.appendChild(span3);

  labelEl4.appendChild(hardBotDiff);
  labelEl4.appendChild(span4);

  formRow3.appendChild(labelEl3);
  formRow4.appendChild(labelEl4);

  genericDiv2.appendChild(formRow3);
  genericDiv2.appendChild(formRow4);

  botDifficultySec.appendChild(horizontalDividerContainer2);
  botDifficultySec.appendChild(genericDiv2);

  horizontalDividerContainer1.appendChild(horizontalDivider1);
  horizontalDividerContainer1.appendChild(audioControlsHeader);
  horizontalDividerContainer1.appendChild(horizontalDivider2);

  labelEl1.appendChild(volumeCheckBox);
  labelEl1.appendChild(span1);

  labelEl2.appendChild(sfxCheckBox);
  labelEl2.appendChild(span2);

  formRow1.appendChild(labelEl1);
  formRow2.appendChild(labelEl2);

  genericDiv1.appendChild(formRow1);
  genericDiv1.appendChild(formRow2);

  audioControllerContainer.appendChild(horizontalDividerContainer1);
  audioControllerContainer.appendChild(genericDiv1);

  settingsForm.appendChild(formSettingsHeader);
  settingsForm.appendChild(audioControllerContainer);
  settingsForm.appendChild(botDifficultySec);
  settingsForm.appendChild(submitSec);

  genericContainer.appendChild(settingsForm);

  settingsPageContainer.appendChild(genericContainer);

  return { settingsPageContainer, settingsForm };
}
