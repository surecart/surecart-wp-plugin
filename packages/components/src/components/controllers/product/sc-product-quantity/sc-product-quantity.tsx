import { Component, Host, h, Prop } from '@stencil/core';
import { state } from '@store/product';
import { getMaxStockQuantity } from '../../../../functions/quantity';
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

  /** Size of the control */
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
    const maxStockQuantity = getMaxStockQuantity(state?.product, state?.selectedVariant);

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
          <sc-quantity-select
            size={this.size}
            quantity={Math.max(state.selectedPrice?.ad_hoc ? 1 : state.quantity, 1)}
            disabled={state.selectedPrice?.ad_hoc}
            onScInput={e => (state.quantity = e.detail)}
            {...(!!maxStockQuantity ? { max: maxStockQuantity } : {})}
          />
        </sc-form-control>
      </Host>
    );
  }
}
