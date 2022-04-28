import { Component, Element, Event, EventEmitter, h, Listen, Method, Prop } from '@stencil/core';

import { serialize } from '../../../functions/form';

@Component({
  tag: 'sc-form',
  styleUrl: 'sc-form.scss',
  shadow: false,
})
export class ScForm {
  @Element() form: HTMLElement;
  private formElement: HTMLFormElement;

  /** Prevent the form from validating inputs before submitting. */
  @Prop({ reflect: true, mutable: true }) novalidate: boolean = false;

  /**
   * Emitted when the form is submitted. This event will not be emitted if any form control inside of
   * it is in an invalid state, unless the form has the `novalidate` attribute. Note that there is never a need to prevent
   * this event, since it doen't send a GET or POST request like native forms. To "prevent" submission, use a conditional
   * around the XHR request you use to submit the form's data with.
   */
  @Event() scSubmit: EventEmitter<void>;

  /**
   * Backwards compat.
   */
  @Event() scFormSubmit: EventEmitter<void>;

  /**
   * Emitted when the form is submitted. This event will not be emitted if any form control inside of
   * it is in an invalid state, unless the form has the `novalidate` attribute. Note that there is never a need to prevent
   * this event, since it doen't send a GET or POST request like native forms. To "prevent" submission, use a conditional
   * around the XHR request you use to submit the form's data with.
   */
  @Event() scFormChange: EventEmitter<Object>;

  /** Serializes all form controls elements and returns a `FormData` object. */
  @Method('getFormData')
  async getFormData() {
    return new FormData(this.formElement);
  }

  @Method('getFormJson')
  async getFormJson() {
    return serialize(this.formElement);
  }

  @Listen('scChange')
  async handleChange() {
    this.scFormChange.emit(serialize(this.formElement));
  }

  @Method('submit')
  async submit() {
    return this.submitForm();
  }

  /** Gets all form control elements (native and custom). */
  getFormControls() {
    return [...this.form.querySelectorAll('*')] as HTMLElement[];
  }

  @Method('validate')
  async validate() {
    const formControls = this.getFormControls();
    const formControlsThatReport = formControls.filter((el: any) => typeof el.reportValidity === 'function') as any;

    if (!this.novalidate) {
      for (const el of formControlsThatReport) {
        const isValid = await el.reportValidity();

        if (!isValid) {
          return false;
        }
      }
    }

    return true;
  }

  submitForm() {
    // Calling form.submit() seems to bypass the submit event and constraint validation. Instead, we can inject a
    // native submit button into the form, click it, then remove it to simulate a standard form submission.
    const button = document.createElement('button');
    if (this.formElement) {
      button.type = 'submit';
      button.style.position = 'absolute';
      button.style.width = '0';
      button.style.height = '0';
      button.style.clip = 'rect(0 0 0 0)';
      button.style.clipPath = 'inset(50%)';
      button.style.overflow = 'hidden';
      button.style.whiteSpace = 'nowrap';
      this.formElement.append(button);
      button.click();
      button.remove();
    }
  }

  render() {
    return (
      <div part="base" class="form" role="form">
        <form
          ref={el => (this.formElement = el as HTMLFormElement)}
          onSubmit={async e => {
            e.preventDefault();
            const isValid = await this.validate();
            if (!isValid) {
              return false;
            }
            this.scSubmit.emit();
            this.scFormSubmit.emit();
          }}
          novalidate={this.novalidate}
        >
          <slot />
        </form>
      </div>
    );
  }
}
