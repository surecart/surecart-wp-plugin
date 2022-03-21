import { Component, h, Element, Prop, Event, EventEmitter, Method, Listen } from '@stencil/core';
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
    return this.formElement.submit();
  }

  // private controls = ['button', 'fieldset', 'input', 'keygen', 'label', 'meter', 'output', 'progress', 'select', 'textarea', 'sc-button', 'sc-price-input', 'sc-input'];

  /** Gets all form control elements (native and custom). */
  getFormControls() {
    return [...this.form.querySelectorAll('*')] as HTMLElement[];
    // return ([...this.form.querySelectorAll('*')] as HTMLElement[]).filter((el: HTMLElement) => this.controls.includes(el.tagName.toLowerCase())) as HTMLElement[];
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

  render() {
    return (
      <div part="base" class="form" role="form">
        <form
          ref={el => (this.formElement = el as HTMLFormElement)}
          onSubmit={async e => {
            console.log(e);
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
