import { Component, h, Prop, Element, Listen } from '@stencil/core';

@Component({
  tag: 'ce-form-control',
  styleUrl: 'ce-form-control.scss',
  shadow: true,
})
export class CEFormControl {
  @Element() el: HTMLCeFormControlElement;

  @Prop({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium';
  @Prop() showLabel: boolean = true;
  @Prop() label: string;
  @Prop() labelId: string;
  @Prop() inputId: string;
  @Prop() required: boolean = false;
  @Prop() errorMessage: string = '';
  @Prop() help: string;
  @Prop() helpId: string;

  @Listen('ceChange')
  handleInputChange() {
    this.errorMessage = '';
  }

  render() {
    return (
      <div
        part="form-control"
        class={{
          'form-control': true,
          'form-control--small': this.size === 'small',
          'form-control--medium': this.size === 'medium',
          'form-control--large': this.size === 'large',
          'form-control--has-label': !!this.label && this.showLabel,
          'form-control--has-help-text': !!this.help,
          'form-control--is-required': !!this.required,
        }}
      >
        <label part="label" id={this.labelId} class="form-control__label" htmlFor={this.inputId} aria-hidden={!!this.label ? 'false' : 'true'}>
          <slot name="label">{this.label}</slot>
        </label>
        <div class="form-control__input">
          {this.errorMessage ? (
            <ce-tooltip text={this.errorMessage} type="danger" freeze open>
              <slot></slot>
            </ce-tooltip>
          ) : (
            <slot></slot>
          )}
        </div>
        {this.help && (
          <div part="help-text" id={this.helpId} class="form-control__help-text">
            <slot name="help-text">{this.help}</slot>
          </div>
        )}
      </div>
    );
  }
}
