import { Component, h, Prop, Element, Watch } from '@stencil/core';
import { openWormhole } from 'stencil-wormhole';

@Component({
  tag: 'ce-form-control',
  styleUrl: 'ce-form-control.scss',
  shadow: true,
})
export class CEFormControl {
  @Element() el: HTMLCeFormControlElement;

  /** Size of the label */
  @Prop({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium';

  /** Name for the input. Used for validation errors. */
  @Prop() name: string;

  /** Display server-side validation errors. */
  @Prop() errors: any;

  /** Show the label. */
  @Prop() showLabel: boolean = true;

  /** Input label. */
  @Prop() label: string;

  /** Input label id. */
  @Prop() labelId: string;

  /** Input id. */
  @Prop() inputId: string;

  /** Whether the input is required. */
  @Prop() required: boolean = false;

  /** Help text */
  @Prop() help: string;

  /** Help id */
  @Prop() helpId: string;

  /** Store the error message */
  @Prop({ mutable: true }) errorMessage: string;

  @Watch('errors')
  handleErrors() {
    this.errorMessage = this?.errors?.[this?.name];
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
          {!!this.errorMessage ? (
            <ce-tooltip text={this.errorMessage} type="danger" padding={10} freeze open onClick={() => (this.errorMessage = '')}>
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

openWormhole(CEFormControl, ['errors'], false);
