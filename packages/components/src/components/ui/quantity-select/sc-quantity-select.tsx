import { Component, h, Prop, Element, Event, EventEmitter } from '@stencil/core';
import { __, sprintf } from '@wordpress/i18n';
import { speak } from '@wordpress/a11y';
import { isRtl } from '../../../functions/page-align';

/**
 * @part base - The elements base wrapper.
 * @part input - The input control.
 * @part minus - The minus control.
 * @part minus-icon - The minus icon.
 * @part plus - The plus control.
 * @part plus-icon - The plus icon.
 */
@Component({
  tag: 'sc-quantity-select',
  styleUrl: 'sc-quantity-select.scss',
  shadow: true,
})
export class ScQuantitySelect {
  @Element() el: HTMLScQuantitySelectElement;
  private input: HTMLInputElement;

  @Prop() clickEl?: HTMLElement;

  @Prop() disabled: boolean;
  @Prop() max: number = Infinity;
  @Prop() min: number = 1;
  @Prop({ mutable: true, reflect: true }) quantity: number = 0;
  @Prop() productName: string = 'Product';

  @Prop({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium';

  /** Inputs focus */
  @Prop({ mutable: true, reflect: true }) hasFocus: boolean;

  @Event({ cancelable: true }) scChange: EventEmitter<number>;

  /** Emitted when the control receives input. */
  @Event({ cancelable: true }) scInput: EventEmitter<number>;

  /** Emitted when the control gains focus. */
  @Event() scFocus: EventEmitter<void>;

  /** Emitted when the control loses focus. */
  @Event() scBlur: EventEmitter<void>;

  decrease() {
    if (this.disabled) return;
    this.quantity = Math.max(this.quantity - 1, this.min);
    // translators: %1$s is the product name
    speak(sprintf(__('Decreased %1$s quantity by one', 'surecart'), this.productName), 'assertive');
    this.scChange.emit(this.quantity);
    this.scInput.emit(this.quantity);
  }

  increase() {
    if (this.disabled) return;
    this.quantity = Math.min(this.quantity + 1, this.max);
    // translators: %1$s is the product name
    speak(sprintf(__('Increased %1$s quantity by one', 'surecart'), this.productName), 'assertive');
    this.scChange.emit(this.quantity);
    this.scInput.emit(this.quantity);
  }

  handleBlur() {
    this.hasFocus = false;
    this.scBlur.emit();
  }

  handleFocus() {
    this.hasFocus = true;
    this.scFocus.emit();
  }

  handleChange() {
    this.quantity = parseInt(this.input.value) > this.max ? this.max : parseInt(this.input.value);
    // translators: %1$s is the product name, %2$s is the quantity
    speak(sprintf(__('Quantity of %1$s changed to %2$s', 'surecart'), this.productName, this.quantity), 'assertive');
    this.scChange.emit(this.quantity);
  }

  handleInput() {
    this.quantity = parseInt(this.input.value);
    this.scInput.emit(this.quantity);
  }

  render() {
    return (
      <div
        part="base"
        class={{
          'quantity': true,
          // States
          'quantity--focused': this.hasFocus,
          'quantity--disabled': this.disabled,
          'quantity--is-rtl': isRtl(),
          'quantity--small': this.size === 'small',
        }}
      >
        <button
          part="minus"
          aria-label={
            /** translators: %1$s: product name */
            sprintf(__('Decrease %1$s quantity by one', 'surecart'), this.productName)
          }
          aria-disabled={this.disabled || (this.quantity <= this.min && this.min > 1)}
          class={{ 'button__decrease': true, 'button--disabled': this.quantity <= this.min && this.min > 1 }}
          onClick={() => this.quantity > this.min && this.decrease()}
          disabled={this.disabled || (this.quantity <= this.min && this.min > 1)}
        >
          <sc-icon name="minus" exportparts="base:minus__icon"></sc-icon>
        </button>

        <input
          part="input"
          class="input__control"
          ref={el => (this.input = el as HTMLInputElement)}
          step="1"
          type="number"
          max={this.max}
          min={this.min}
          value={this.quantity}
          disabled={this.disabled}
          autocomplete="off"
          role="spinbutton"
          aria-valuemax={this.max}
          aria-valuemin={this.min}
          aria-valuenow={this.quantity}
          aria-disabled={this.disabled}
          onChange={() => this.handleChange()}
          onInput={() => this.handleInput()}
          onFocus={() => this.handleFocus()}
          onBlur={() => this.handleBlur()}
          aria-label={
            /** translators: %1$s: product name */
            sprintf(__('Quantity input for %1$s product', 'surecart'), this.productName)
          }
        />

        <button
          part="plus"
          aria-label={
            /** translators: %1$s: product name */
            sprintf(__('Increase %1$s quantity by one', 'surecart'), this.productName)
          }
          class={{ 'button__increase': true, 'button--disabled': this.quantity >= this.max }}
          onClick={() => this.quantity < this.max && this.increase()}
          aria-disabled={this.disabled || this.quantity >= this.max}
          disabled={this.disabled || this.quantity >= this.max}
        >
          <sc-icon name="plus" exportparts="base:plus__icon"></sc-icon>
        </button>
      </div>
    );
  }
}
