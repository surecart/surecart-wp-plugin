interface FormDataEvent extends Event {
  readonly formData: FormData;
}
interface FormDataEventInit extends EventInit {
  formData: FormData;
}
declare var FormDataEvent: {
  prototype: FormDataEvent;
  new (type: string, eventInitDict?: FormDataEventInit): FormDataEvent;
};

export const addFormData = (input: any) => {
  const form = input?.closest('ce-form')?.shadowRoot?.querySelector('form');
  if (form) {
    form.addEventListener('formdata', (event: FormDataEvent) => handleFormData(input, event));
    form.addEventListener('submit', event => handleFormSubmit(input, form, event));
  }
};

export const removeFormData = (input: any) => {
  const form = input.closest('form');
  form.removeEventListener('formdata', (event: FormDataEvent) => handleFormData(input, event));
  form.removeEventListener('submit', event => handleFormSubmit(input, form, event));
};

export const handleFormData = (input: any, event: FormDataEvent) => {
  if (!input?.disabled && typeof input.name === 'string' && typeof input.value !== 'undefined') {
    if (Array.isArray(input.value)) {
      (input.value as unknown[]).forEach(val => {
        event.formData.append(input.name, (val as string | number | boolean).toString());
      });
    } else {
      const value = input.value ? input.value : '';
      event.formData.append(input.name, (value as string | number | boolean).toString());
    }
  }
};

export const handleFormSubmit = (input: any, form: HTMLFormElement, event) => {
  // prevent submission if there are any invalid inputs.
  if (form && !form.noValidate && !input?.disabled && !input.reportValidity()) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }
};
