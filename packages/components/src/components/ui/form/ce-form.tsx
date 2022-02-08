import { Component, h, Element, Prop, Event, EventEmitter, Method, Listen } from '@stencil/core';
import { serialize } from '../../../functions/form';
@Component({
  tag: 'ce-form',
  styleUrl: 'ce-form.scss',
  shadow: false,
})
export class CEForm {
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
  @Event() ceFormSubmit: EventEmitter<void>;

  /**
   * Emitted when the form is submitted. This event will not be emitted if any form control inside of
   * it is in an invalid state, unless the form has the `novalidate` attribute. Note that there is never a need to prevent
   * this event, since it doen't send a GET or POST request like native forms. To "prevent" submission, use a conditional
   * around the XHR request you use to submit the form's data with.
   */
  @Event() ceFormChange: EventEmitter<Object>;

  /** Serializes all form controls elements and returns a `FormData` object. */
  @Method('getFormData')
  async getFormData() {
    return new FormData(this.formElement);
  }

  @Method('getFormJson')
  async getFormJson() {
    return serialize(this.formElement);
  }

  @Listen('ceChange')
  async handleChange() {
    this.ceFormChange.emit(serialize(this.formElement));
  }

  /**
   * Submits the form. If all controls are valid, the `ce-submit` event will be emitted and the promise will resolve
   * with `true`. If any form control is invalid, the promise will resolve with `false` and no event will be emitted.
   */
  @Method('submit')
  async submit() {
    return this.formElement.submit();
  }

  render() {
    return (
      <div part="base" class="form" role="form">
        <form
          ref={el => (this.formElement = el as HTMLFormElement)}
          onSubmit={e => {
            e.preventDefault();
            this.ceFormSubmit.emit();
          }}
          novalidate={this.novalidate}
        >
          <slot></slot>
        </form>
      </div>
    );
  }
}
