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

export interface FormSubmitControllerOptions {
  /** A function that returns the form containing the form control. */
  form: (input: unknown) => HTMLFormElement | null;
  /** A function that returns the form control's name, which will be submitted with the form data. */
  name: (input: unknown) => string;
  /** A function that returns the form control's current value. */
  value: (input: unknown) => unknown | unknown[];
  /** A function that returns the form control's current disabled state. If disabled, the value won't be submitted. */
  disabled: (input: unknown) => boolean;
  /**
   * A function that maps to the form control's reportValidity() function. When the control is invalid, this will
   * prevent submission and trigger the browser's constraint violation warning.
   */
  reportValidity: (input: unknown) => boolean;
}

export const addFormData = (input: any, options?: Partial<FormSubmitControllerOptions>) => {
  const formOptions = {
    form: (input: HTMLInputElement) => input?.closest('ce-form')?.shadowRoot?.querySelector('form') || input.closest('form'),
    name: (input: HTMLInputElement) => input.name,
    value: (input: HTMLInputElement) => input.value,
    disabled: (input: HTMLInputElement) => input.disabled,
    reportValidity: (input: HTMLInputElement) => {
      return typeof input.reportValidity === 'function' ? input.reportValidity() : true;
    },
    ...options,
  };

  const form = formOptions.form(input);

  if (form) {
    form.addEventListener('formdata', (event: FormDataEvent) => handleFormData(input, event, formOptions));
    form.addEventListener('submit', event => handleFormSubmit(input, form, event, formOptions));
  }
};

export const removeFormData = (input: any, options?: Partial<FormSubmitControllerOptions>) => {
  const formOptions = {
    form: (input: HTMLInputElement) => input?.closest('ce-form')?.shadowRoot?.querySelector('form') || input.closest('form'),
    name: (input: HTMLInputElement) => input.name,
    value: (input: HTMLInputElement) => input.value,
    disabled: (input: HTMLInputElement) => input.disabled,
    reportValidity: (input: HTMLInputElement) => {
      return typeof input.reportValidity === 'function' ? input.reportValidity() : true;
    },
    ...options,
  };

  const form = formOptions.form(input);

  form.removeEventListener('formdata', (event: FormDataEvent) => handleFormData(input, event, formOptions));
  form.removeEventListener('submit', event => handleFormSubmit(input, form, event, formOptions));
};

export const handleFormData = (input: any, event: FormDataEvent, options: FormSubmitControllerOptions) => {
  const disabled = options.disabled(input);
  const name = options.name(input);
  const value = options.value(input);

  if (!disabled && typeof name === 'string' && typeof value !== 'undefined') {
    if (Array.isArray(value)) {
      (value as unknown[]).forEach(val => {
        event.formData.append(name, (val as string | number | boolean).toString());
      });
    } else {
      console.log({ value });
      event.formData.append(name, (value as string | number | boolean).toString());
    }
  }
};

export const handleFormSubmit = (input: any, form: HTMLFormElement, event, options: FormSubmitControllerOptions) => {
  const disabled = options.disabled(input);
  const reportValidity = options.reportValidity;
  // prevent submission if there are any invalid inputs.
  if (form && !form.noValidate && !disabled && !reportValidity(input)) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }
};
