import { Element, Method, State, Watch } from '@stencil/core';
import { Component, h, Prop } from '@stencil/core';
import { __, sprintf } from '@wordpress/i18n';
import { Price, Product, Variant } from '../../../../types';
import { getLineItemByProductId } from '@store/checkout/getters';
import { state as checkoutState, onChange } from '@store/checkout';
import { getVariantFromValues } from '../../../../functions/util';
import { addLineItem, updateLineItem } from '@services/session';
import { updateFormState } from '@store/form/mutations';
import { createErrorNotice } from '@store/notices/mutations';
import { isProductVariantOptionSoldOut } from '@store/utils';

@Component({
  tag: 'sc-checkout-product-price-variant-selector',
  styleUrl: 'sc-checkout-product-price-variant-selector.scss',
  shadow: false,
})
export class ScProductCheckoutSelectVariantOption {
  private input: HTMLInputElement;
  @Element() el: HTMLScCheckoutProductPriceVariantSelectorElement;

  /** The product. */
  @Prop() product: Product;

  /** The label for the price. */
  @Prop() label: string;

  /** Currently selected variant */
  @State() selectedVariant: Variant;

  /** Currently selected price */
  @State() selectedPrice: Price;

  /** The first selected option value */
  @State() option1: string;

  /** The second selected option value */
  @State() option2: string;

  /** The third selected option value */
  @State() option3: string;

  /** When option values are selected, attempt to find a matching variant. */
  @Watch('option1')
  @Watch('option2')
  @Watch('option3')
  handleOptionChange() {
    this.selectedVariant = getVariantFromValues({
      variants: this.product?.variants?.data,
      values: {
        ...(this.option1 ? { option_1: this.option1 } : {}),
        ...(this.option2 ? { option_2: this.option2 } : {}),
        ...(this.option3 ? { option_3: this.option3 } : {}),
      },
    });
  }

  /**
   * Is the selected variant out of stock?
   * @returns {boolean} Whether the selected variant is out of stock.
   */
  isSelectedVariantOutOfStock() {
    return this.product?.stock_enabled && this.hasVariants() && !this.product?.allow_out_of_stock_purchases && this.selectedVariant.available_stock < 1;
  }

  /**
   * Do we have the required selected variant?
   * @returns {boolean} Whether the product has a required variant and it is not selected.
   */
  hasRequiredSelectedVariant() {
    return this.hasVariants() && this.selectedVariant?.id;
  }

  @Method()
  async reportValidity() {
    this.input.setCustomValidity('');

    if (!this.hasVariants()) {
      return this.input.reportValidity();
    }

    // We don't have a required selected variant.
    if (!this.hasRequiredSelectedVariant()) {
      this.input.setCustomValidity(__('Please choose an available option.', 'surecart'));
      return this.input.reportValidity();
    }

    // don't let the person checkout with an out of stock selection.
    if (this.isSelectedVariantOutOfStock()) {
      this.input.setCustomValidity(__('This selection is not available.', 'surecart'));
      return this.input.reportValidity();
    }

    return this.input.reportValidity();
  }

  /** When selected variant and selected price are set, we can update the checkout. */
  @Watch('selectedVariant')
  @Watch('selectedPrice')
  async updateLineItems() {
    // We need a price.
    if (!this.selectedPrice?.id) return;
    // get the existing line item.
    const lineItem = this.lineItem();
    // no changes.
    if (lineItem?.price?.id === this.selectedPrice?.id && lineItem?.variant?.id === this.selectedVariant?.id) return;
    // We need a selected variant if this product has variants.
    if (!this.hasRequiredSelectedVariant()) return;
    // Don't let the person checkout with an out of stock selection.
    if (this.isSelectedVariantOutOfStock()) return;

    // create or update the
    try {
      updateFormState('FETCH');
      if (lineItem?.id) {
        checkoutState.checkout = await updateLineItem({
          id: lineItem?.id,
          data: {
            variant: this.selectedVariant?.id,
            price: this.selectedPrice?.id,
            quantity: 1,
          },
        });
      } else {
        checkoutState.checkout = await addLineItem({
          checkout: checkoutState.checkout,
          data: {
            variant: this.selectedVariant?.id,
            price: this.selectedPrice?.id,
            quantity: 1,
          },
        });
      }
      updateFormState('RESOLVE');
    } catch (e) {
      console.error(e);
      createErrorNotice(e);
      updateFormState('REJECT');
    }
  }

  private removeListener;
  componentWillLoad() {
    // when checkout changes, update the selected variant and price.
    this.removeListener = onChange('checkout', () => {
      const lineItem = this.lineItem();
      this.selectedVariant = lineItem?.variant;
      this.selectedPrice = lineItem?.price;
      this.option1 = lineItem?.variant?.option_1;
      this.option2 = lineItem?.variant?.option_2;
      this.option3 = lineItem?.variant?.option_3;
    });
  }

  // remove listener to prevent leaks.
  disconnectedCallback() {
    this.removeListener();
  }

  // get the line item by product id.
  lineItem() {
    return getLineItemByProductId(this.product?.id);
  }

  hasVariants() {
    return this.product?.variants?.data?.length > 0;
  }

  render() {
    return (
      <div class="sc-checkout-product-price-variant-selector">
        {(this.product.variant_options.data || []).map(({ name, values }, index) => (
          <sc-form-control label={name}>
            <div class="sc-checkout-product-price-variant-selector__pills-wrapper">
              {(values || []).map(value => {
                const isUnavailable =
                  this.product?.stock_enabled &&
                  !this.product?.allow_out_of_stock_purchases &&
                  isProductVariantOptionSoldOut(
                    index + 1,
                    value,
                    {
                      ...(this.option1 ? { option_1: this.option1 } : {}),
                      ...(this.option2 ? { option_2: this.option2 } : {}),
                      ...(this.option3 ? { option_3: this.option3 } : {}),
                    },
                    this.product,
                  );
                return (
                  <sc-pill-option isUnavailable={isUnavailable} isSelected={this[`option${index + 1}`] === value} onClick={() => (this[`option${index + 1}`] = value)}>
                    <span class="sc-sr-only">{sprintf(__('Select %s:', 'surecart'), name)} </span>
                    {value}
                    {isUnavailable && <span class="sc-sr-only"> {__('(option unavailable)', 'surecart')} </span>}
                  </sc-pill-option>
                );
              })}
            </div>
          </sc-form-control>
        ))}

        {this.product?.prices?.data?.length > 1 && (
          <sc-form-control label={!!this.product.variant_options.data?.length ? this.label : null}>
            <sc-choices>
              {(this.product.prices.data || [])
                .sort((a, b) => a?.position - b?.position)
                .map(price => (
                  <sc-price-choice-container
                    required={true}
                    price={price}
                    label={price?.name || this.product?.name}
                    checked={this.lineItem()?.price?.id === price?.id}
                    onScChange={e => {
                      if (e.target.checked) {
                        this.selectedPrice = price;
                      }
                    }}
                  ></sc-price-choice-container>
                ))}
            </sc-choices>
          </sc-form-control>
        )}

        <input class="sc-checkout-product-price-variant-selector__hidden-input" ref={el => (this.input = el as HTMLInputElement)} value={this.selectedVariant?.id}></input>
      </div>
    );
  }
}
