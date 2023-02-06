import { Component, Host, h, Prop } from '@stencil/core';
import state from '../../../../store/product';
let id = 0;

@Component({
  tag: 'sc-product-quantity',
  styleUrl: 'sc-product-quantity.css',
  shadow: true,
})
export class ScProductQuantity {
  private inputId: string = `sc-quantity-${++id}`;
  private helpId = `sc-quantity-help-text-${id}`;
  private labelId = `sc-quantity-label-${id}`;

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

  /** Whether the input is required. */
  @Prop() required: boolean = false;

  /** Help text */
  @Prop() help: string;

  render() {
    return (
      <Host>
        <sc-form-control
          exportparts="label, help-text, form-control"
          size={this.size}
          required={this.required}
          label={this.label}
          showLabel={this.showLabel}
          help={this.help}
          inputId={this.inputId}
          helpId={this.helpId}
          labelId={this.labelId}
          name={this.name}
        >
          <sc-quantity-select quantity={state.quantity} onScInput={e => (state.quantity = e.detail)}></sc-quantity-select>
        </sc-form-control>
      </Host>
    );
  }
}
