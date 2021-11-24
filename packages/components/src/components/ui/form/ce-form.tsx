import { Component, h, Element, Prop, Event, EventEmitter, Method, Listen } from '@stencil/core';

interface FormControl {
  tag: string;
  serialize: (el: HTMLElement, formData: FormData | object) => void;
  click?: (event: MouseEvent) => any;
  keyDown?: (event: KeyboardEvent) => any;
}

@Component({
  tag: 'ce-form',
  styleUrl: 'ce-form.scss',
  shadow: true,
})
export class CEForm {
  @Element() form: HTMLElement;

  /** Prevent the form from validating inputs before submitting. */
  @Prop({ reflect: true, mutable: true }) novalidate: boolean = false;

  /**
   * Emitted when the form is submitted. This event will not be emitted if any form control inside of
   * it is in an invalid state, unless the form has the `novalidate` attribute. Note that there is never a need to prevent
   * this event, since it doen't send a GET or POST request like native forms. To "prevent" submission, use a conditional
   * around the XHR request you use to submit the form's data with.
   */
  @Event() ceFormSubmit: EventEmitter<void>;

  /**
   * Emitted when the form is submitted. This event will not be emitted if any form control inside of
   * it is in an invalid state, unless the form has the `novalidate` attribute. Note that there is never a need to prevent
   * this event, since it doen't send a GET or POST request like native forms. To "prevent" submission, use a conditional
   * around the XHR request you use to submit the form's data with.
   */
  @Event() ceFormChange: EventEmitter<Object>;

  /**
   * Emitted when the form is invalid.
   */
  @Event() ceFormInvalid: EventEmitter<Object>;

  private formControls: FormControl[];

  appendData(formData: FormData | object, name: string, value: any) {
    return formData instanceof FormData ? formData.append(name, value) : (formData[name] = value);
  }

  componentWillLoad() {
    this.formControls = [
      {
        tag: 'button',
        serialize: (el: HTMLButtonElement, formData) => (el.name && !el.disabled ? this.appendData(formData, el.name, el.value) : null),
        click: event => {
          const target = event.target as HTMLButtonElement;
          if (target.type === 'submit') {
            this.submit();
          }
        },
      },
      {
        tag: 'input',
        serialize: (el: HTMLInputElement, formData) => {
          if (!el.name || el.disabled) {
            return;
          }

          if ((el.type === 'checkbox' || el.type === 'radio') && !el.checked) {
            return;
          }

          if (el.type === 'file') {
            [...(el.files as FileList)].map(file => this.appendData(formData, el.name, file));
            return;
          }

          this.appendData(formData, el.name, el.value);
        },
        click: event => {
          const target = event.target as HTMLInputElement;
          if (target.type === 'submit') {
            this.submit();
          }
        },
        keyDown: event => {
          const target = event.target as HTMLInputElement;
          if (event.key === 'Enter' && !event.defaultPrevented && !['checkbox', 'file', 'radio'].includes(target.type)) {
            this.submit();
          }
        },
      },
      {
        tag: 'select',
        serialize: (el: HTMLSelectElement, formData) => {
          if (el.name && !el.disabled) {
            if (el.multiple) {
              const selectedOptions = [...el.querySelectorAll('option:checked')];
              if (selectedOptions.length) {
                selectedOptions.map((option: HTMLOptionElement) => this.appendData(formData, el.name, option.value));
              } else {
                this.appendData(formData, el.name, '');
              }
            } else {
              this.appendData(formData, el.name, el.value);
            }
          }
        },
      },
      {
        tag: 'ce-button',
        serialize: (el: any, formData) => (el.name && !el.disabled ? this.appendData(formData, el.name, el.value) : null),
        click: event => {
          const target = event.target as any;
          if (target.submit) {
            this.submit();
          }
        },
      },
      {
        tag: 'ce-checkbox',
        serialize: (el: any, formData) => (el.name && el.checked && !el.disabled ? this.appendData(formData, el.name, el.value) : null),
      },
      {
        tag: 'ce-color-picker',
        serialize: (el: any, formData) => (el.name && !el.disabled ? this.appendData(formData, el.name, el.value) : null),
      },
      {
        tag: 'ce-price-input',
        serialize: (el: any, formData) => {
          if (el.name && !el.disabled) {
            return this.appendData(formData, el.name, el.value);
          } else {
            null;
          }
        },
        keyDown: event => {
          if (event.key === 'Enter' && !event.defaultPrevented) {
            this.submit();
          }
        },
      },
      {
        tag: 'ce-input',
        serialize: (el: any, formData) => {
          if (el.name && !el.disabled) {
            return this.appendData(formData, el.name, el.value);
          } else {
            null;
          }
        },
        keyDown: event => {
          if (event.key === 'Enter' && !event.defaultPrevented) {
            this.submit();
          }
        },
      },
      {
        tag: 'ce-radio',
        serialize: (el: any, formData) => (el.name && el.checked && !el.disabled ? this.appendData(formData, el.name, el.value) : null),
      },
      {
        tag: 'ce-choice',
        serialize: (el: any, formData) => (el.name && el.checked && !el.disabled ? this.appendData(formData, el.name, el.value) : null),
      },
      {
        tag: 'ce-select',
        serialize: (el: any, formData) => {
          if (el.name && !el.disabled) {
            if (el.multiple) {
              const selectedOptions = [...el.value];
              if (selectedOptions.length) {
                selectedOptions.map(value => this.appendData(formData, el.name, value));
              } else {
                this.appendData(formData, el.name, '');
              }
            } else {
              this.appendData(formData, el.name, el.value + '');
            }
          }
        },
      },
      {
        tag: 'ce-switch',
        serialize: (el: any, formData) => (el.name && el.checked && !el.disabled ? this.appendData(formData, el.name, el.value) : null),
      },
      {
        tag: 'ce-textarea',
        serialize: (el: any, formData) => (el.name && !el.disabled ? this.appendData(formData, el.name, el.value) : null),
      },
      {
        tag: 'textarea',
        serialize: (el: HTMLTextAreaElement, formData) => (el.name && !el.disabled ? this.appendData(formData, el.name, el.value) : null),
      },
    ];
  }

  /** Gets all form control elements (native and custom). */
  getFormControls() {
    const slot = this.form.shadowRoot.querySelector('slot') as HTMLSlotElement;
    const tags = this.formControls.map(control => control.tag);
    return slot
      .assignedElements({ flatten: true })
      .reduce((all: HTMLElement[], el: HTMLElement) => all.concat(el, [...el.querySelectorAll('*')] as HTMLElement[]), [])
      .filter((el: HTMLElement) => tags.includes(el.tagName.toLowerCase())) as HTMLElement[];
  }

  /** Serializes all form controls elements and returns a `FormData` object. */
  @Method('getFormData')
  async getFormData() {
    const formData = new FormData();
    const formControls = this.getFormControls();

    formControls.map(el => this.serializeElement(el, formData));

    return formData;
  }

  @Method('getFormJson')
  async getFormJson() {
    const data = {};
    const formControls = this.getFormControls();
    formControls.map(el => this.serializeElement(el, data));
    return data;
  }

  @Method('validate')
  async validate() {
    const formControls = this.getFormControls();
    const formControlsThatReport = formControls.filter((el: any) => typeof el.reportValidity === 'function') as any;

    if (!this.novalidate) {
      for (const el of formControlsThatReport) {
        const isValid = await el.reportValidity();

        if (!isValid) {
          this.ceFormInvalid.emit();
          await el.reportValidity();
          return false;
        }
      }
    }

    return true;
  }

  @Listen('ceChange')
  async handleChange() {
    let data = await this.getFormJson();
    this.ceFormChange.emit(data);
  }

  /**
   * Submits the form. If all controls are valid, the `ce-submit` event will be emitted and the promise will resolve
   * with `true`. If any form control is invalid, the promise will resolve with `false` and no event will be emitted.
   */
  @Method('submit')
  async submit() {
    const isValid = await this.validate();

    if (!isValid) {
      return false;
    }

    this.ceFormSubmit.emit();

    return true;
  }

  handleClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const tag = target.tagName.toLowerCase();

    for (const formControl of this.formControls) {
      if (formControl.tag === tag && formControl.click) {
        formControl.click(event);
      }
    }
  }

  handleKeyDown(event: KeyboardEvent) {
    const target = event.target as HTMLElement;
    const tag = target.tagName.toLowerCase();

    for (const formControl of this.formControls) {
      if (formControl.tag === tag && formControl.keyDown) {
        formControl.keyDown(event);
      }
    }
  }

  serializeElement(el: HTMLElement, formData: FormData | object) {
    const tag = el.tagName.toLowerCase();

    for (const formControl of this.formControls) {
      if (formControl.tag === tag) {
        return formControl.serialize(el, formData);
      }
    }

    return null;
  }

  render() {
    return (
      <div part="base" class="form" role="form" onClick={e => this.handleClick(e)} onKeyDown={e => this.handleKeyDown(e)}>
        <slot></slot>
      </div>
    );
  }
}
