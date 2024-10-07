import createElementWithClass from '../helper_module/create-element-with-class.js';

export default function createSettingsModal() {
  const settingsModal = createElementWithClass('dialog', [
    'settings-modal',
    'd-flex__col',
    'align-items__center',
    'justify-content__center',
  ]);

  const genericContainer = createElementWithClass('div', [
    'dialog-content',
    'container',
    'd-flex__col',
    'align-items__center',
    'justify-content__center',
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
    'text-align__center',
    'fz_2-4r',
  ]);

  formSettingsHeader.textContent = 'settings';

  const audioControllerContainer = createElementWithClass('div', [
    'audio-controls-section',
  ]);
  const audioControlsHeader = createElementWithClass('h2', [
    'text-transform__capitalize',
    'audio-section-header',
    'text-align__center',
    'fz_1-8r',
  ]);

  audioControlsHeader.innerHTML = 'sound &amp; effect';

  const genericDiv1 = createElementWithClass('div', [
    'd-flex__col',
    'gap_5',
    'padding_10',
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

  labelEl1.appendChild(volumeCheckBox);
  labelEl1.appendChild(span1);

  labelEl2.appendChild(sfxCheckBox);
  labelEl2.appendChild(span2);

  formRow1.appendChild(labelEl1);
  formRow2.appendChild(labelEl2);

  genericDiv1.appendChild(formRow1);
  genericDiv1.appendChild(formRow2);

  audioControllerContainer.appendChild(audioControlsHeader);
  audioControllerContainer.appendChild(genericDiv1);

  settingsForm.appendChild(formSettingsHeader);
  settingsForm.appendChild(audioControllerContainer);
  settingsForm.appendChild(submitSec);

  genericContainer.appendChild(settingsForm);

  settingsModal.appendChild(genericContainer);

  return {
    settingsForm,
    settingsModal,
  };
}
