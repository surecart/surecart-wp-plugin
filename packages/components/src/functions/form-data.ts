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
}

export class FormSubmitController {
  form: HTMLFormElement | null = null;
  input: any;
  options: FormSubmitControllerOptions;
  constructor(input: any, options?: Partial<FormSubmitControllerOptions>) {
    this.input = input;
    this.options = {
      form: (input: HTMLInputElement) => input?.closest('ce-form')?.shadowRoot?.querySelector('form') || input.closest('form'),
      name: (input: HTMLInputElement) => input.name,
      value: (input: HTMLInputElement) => input.value,
      disabled: (input: HTMLInputElement) => input.disabled,
      ...options,
    };

    this.form = this.options.form(this.input);
    this.handleFormData = this.handleFormData.bind(this);
  }

  addFormData() {
    if (!this.form) return;
    this.form.addEventListener('formdata', this.handleFormData);
  }

  removeFormData() {
    if (!this.form) return;
    this.form.removeEventListener('formdata', this.handleFormData);
  }

  handleFormData(event: FormDataEvent) {
    const disabled = this.options.disabled(this.input);
    const name = this.options.name(this.input);
    const value = this.options.value(this.input);

    if (!disabled && typeof name === 'string' && typeof value !== 'undefined') {
      if (Array.isArray(value)) {
        (value as unknown[]).forEach(val => {
          if (val) {
            event.formData.append(name, (val as string | number | boolean).toString());
          }
        });
      } else {
        if (value) {
          event.formData.append(name, (value as string | number | boolean).toString());
        }
      }
    }
  }
}
