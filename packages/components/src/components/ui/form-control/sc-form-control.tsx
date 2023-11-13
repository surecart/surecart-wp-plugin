import { Component, h, Prop, Element } from '@stencil/core';
import { isRtl } from '../../../functions/page-align';
import { __ } from '@wordpress/i18n';

/**
 * @part form-control - The elements base wrapper.
 * @part label - The label.
 * @part input - The input wrapper.
 * @part help-text - Help text.
 * @part tooltip - Tooltip
 * @part tooltip-text - Tooltip text.
 */
@Component({
  tag: 'sc-form-control',
  styleUrl: 'sc-form-control.scss',
  shadow: true,
})
export class ScFormControl {
  @Element() el: HTMLScFormControlElement;

  /** Size of the label */
  @Prop({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium';

  /** Name for the input. Used for validation errors. */
  @Prop() name: string;

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
          'form-control--is-rtl': isRtl(),
        }}
      >
        <label part="label" id={this.labelId} class="form-control__label" htmlFor={this.inputId} aria-hidden={!!this.label ? 'false' : 'true'}>
          <slot name="label">{this.label}</slot>
          <slot name="label-end"></slot>
          {!!this.required && (
            <span aria-hidden="true" class="required">
              {' '}
              *
            </span>
          )}
          <sc-visually-hidden>{!!this.required ? __('Mandatory field', 'surecart') : ''}</sc-visually-hidden>
        </label>
        <div part="input" class="form-control__input">
          <slot />
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
