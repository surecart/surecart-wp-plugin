import { Component, Host, h, Prop } from '@stencil/core';
import { state } from '@store/product';
import { isStockNeedsToBeChecked } from '@store/product/getters';
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

  getMaxStockQty() {
    // check purchase limit.
    if (state.product?.purchase_limit) {
      return state.product.purchase_limit;
    }

    // If stock is not enabled, return null.
    if (!isStockNeedsToBeChecked) {
      return null;
    }

    // If no variant is selected, check against product stock.
    if (!state?.selectedVariant) return state.product?.available_stock;
    // Check against selected variant's stock.
    return state.selectedVariant?.available_stock;
  }

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
          <sc-quantity-select
            size={this.size}
            quantity={Math.max(state.selectedPrice?.ad_hoc ? 1 : state.quantity, 1)}
            disabled={state.selectedPrice?.ad_hoc}
            onScInput={e => (state.quantity = e.detail)}
            {...(!!this.getMaxStockQty() ? { max: this.getMaxStockQty() } : {})}
          />
        </sc-form-control>
      </Host>
    );
  }
}
