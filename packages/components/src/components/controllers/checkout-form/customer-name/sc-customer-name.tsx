import { Customer, Order } from '../../../../types';
import { createOrUpdateOrder } from '../../../../services/session';
import { Component, Prop, h, Event, EventEmitter, Watch, Method } from '@stencil/core';
import { openWormhole } from 'stencil-wormhole';

@Component({
  tag: 'sc-customer-name',
  shadow: true,
})
export class ScCustomerName {
  private input: HTMLScInputElement;

  /** Is the user logged in. */
  @Prop() loggedIn: boolean;

  /** (passed from the sc-checkout component automatically) */
  @Prop() order: Order;

  /** Force a customer. */
  @Prop() customer: Customer;

  /** The input's size. */
  @Prop({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium';

  /** The input's value attribute. */
  @Prop({ mutable: true }) value = '';

  /** Draws a pill-style input with rounded edges. */
  @Prop({ reflect: true }) pill = false;

  /** The input's label. */
  @Prop() label: string;

  /** Should we show the label */
  @Prop() showLabel: boolean = true;

  /** The input's help text. */
  @Prop() help: string = '';

  /** The input's placeholder text. */
  @Prop() placeholder: string;

  /** Disables the input. */
  @Prop({ reflect: true }) disabled: boolean = false;

  /** Makes the input readonly. */
  @Prop({ reflect: true }) readonly: boolean = false;

  /** Makes the input a required field. */
  @Prop({ reflect: true }) required = false;

  /**
   * This will be true when the control is in an invalid state. Validity is determined by props such as `type`,
   * `required`, `minlength`, `maxlength`, and `pattern` using the browser's constraint validation API.
   */
  @Prop({ mutable: true, reflect: true }) invalid = false;

  /** The input's autofocus attribute. */
  @Prop() autofocus: boolean;

  /** Inputs focus */
  @Prop({ mutable: true, reflect: true }) hasFocus: boolean;

  /** Emitted when the control's value changes. */
  @Event({ composed: true }) scChange: EventEmitter<void>;

  @Event() scUpdateOrderState: EventEmitter<Partial<Order>>;

  /** Emitted when the clear button is activated. */
  @Event() scClear: EventEmitter<void>;

  /** Emitted when the control receives input. */
  @Event() scInput: EventEmitter<void>;

  /** Emitted when the control gains focus. */
  @Event() scFocus: EventEmitter<void>;

  /** Emitted when the control loses focus. */
  @Event() scBlur: EventEmitter<void>;

  @Event() scUpdateCustomer: EventEmitter<{ email: string }>;

  @Method()
  async reportValidity() {
    return this.input.reportValidity();
  }

  async handleChange() {
    this.value = this.input.value;

    // update order.
    try {
      const order = await createOrUpdateOrder({ id: this.order?.id, data: { name: this.input.value } });
      this.scUpdateOrderState.emit(order);
    } catch (error) {
      console.error(error);
    }
  }

  /** Sync customer email with session if it's updated by other means */
  @Watch('order')
  handleSessionChange(val) {
    if (val?.name) {
      if (val.name !== this.value) {
        this.value = val?.name;
      }
    }
  }

  render() {
    return (
      <sc-input
        type="text"
        name="name"
        ref={el => (this.input = el as HTMLScInputElement)}
        value={this.customer?.name || this.value}
        disabled={!!this.loggedIn}
        label={this.label}
        help={this.help}
        autocomplete="name"
        placeholder={this.placeholder}
        readonly={this.readonly}
        required={this.required}
        invalid={this.invalid}
        autofocus={this.autofocus}
        hasFocus={this.hasFocus}
        onScChange={() => this.handleChange()}
        onScInput={() => this.scInput.emit()}
        onScFocus={() => this.scFocus.emit()}
        onScBlur={() => this.scBlur.emit()}
      ></sc-input>
    );
  }
}

openWormhole(ScCustomerName, ['order', 'customer'], false);
