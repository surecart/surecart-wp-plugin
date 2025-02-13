import { Element, Fragment, Method, State, Watch } from '@stencil/core';
import { Component, h, Prop } from '@stencil/core';
import { __, sprintf } from '@wordpress/i18n';
import { Price, Product, Variant } from '../../../../types';
import { getLineItemByProductId } from '@store/checkout/getters';
import { state as checkoutState, onChange } from '@store/checkout';
import { getVariantFromValues } from '../../../../functions/util';
import { addLineItem, updateLineItem } from '@services/session';
import { updateFormState } from '@store/form/mutations';
import { createErrorNotice } from '@store/notices/mutations';
import { isProductVariantOptionMissing, isProductVariantOptionSoldOut } from '@store/utils';

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

  /** The title for price and variant selections */
  @Prop() selectorTitle: string;

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
    if (!this.hasVariants()) {
      return true;
    }
    return this.selectedVariant?.id;
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

  getSelectedPrice() {
    if (this.product?.prices?.data?.length === 1) {
      return this.product?.prices?.data[0];
    }
    return this.selectedPrice;
  }

  /** When selected variant and selected price are set, we can update the checkout. */
  @Watch('selectedVariant')
  @Watch('selectedPrice')
  async updateLineItems() {
    const selectedPrice = this.getSelectedPrice();
    // We need a price.
    if (!selectedPrice?.id) return;
    // get the existing line item.
    const lineItem = this.lineItem();
    // no changes.
    if (lineItem?.price?.id === selectedPrice?.id && lineItem?.variant?.id === this.selectedVariant?.id) return;
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
            price: selectedPrice?.id,
            quantity: 1,
          },
        });
      } else {
        checkoutState.checkout = await addLineItem({
          checkout: checkoutState.checkout,
          data: {
            variant: this.selectedVariant?.id,
            price: selectedPrice?.id,
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

  isProductInCheckout() {
    return (checkoutState.checkout?.line_items?.data || []).some(lineItem => ((lineItem.price as Price)?.product as Product)?.id === this.product?.id);
  }

  render() {
    if (!this.isProductInCheckout()) {
      return null;
    }
    return (
      <sc-form-control class="sc-checkout-product-price-variant-selector" label={this.selectorTitle}>
        {(this.product.variant_options.data || []).map(({ name, values }, index) => (
          <sc-form-control label={name}>
            <div class="sc-checkout-product-price-variant-selector__pills-wrapper">
              {(values || []).map(value => {
                const args = [
                  index + 1,
                  value,
                  {
                    ...(this.option1 ? { option_1: this.option1 } : {}),
                    ...(this.option2 ? { option_2: this.option2 } : {}),
                    ...(this.option3 ? { option_3: this.option3 } : {}),
                  },
                  this.product,
                ];
                const isUnavailable = isProductVariantOptionSoldOut.apply(void 0, args) || isProductVariantOptionMissing.apply(void 0, args);
                return (
                  <sc-pill-option isUnavailable={isUnavailable} isSelected={this[`option${index + 1}`] === value} onClick={() => (this[`option${index + 1}`] = value)}>
                    <span aria-hidden="true">{value}</span>
                    <sc-visually-hidden>
                      {sprintf(__('Select %s: %s', 'surecart'), name, value)}
                      {isUnavailable && <Fragment> {__('(option unavailable)', 'surecart')}</Fragment>}
                    </sc-visually-hidden>
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
      </sc-form-control>
    );
  }
}
