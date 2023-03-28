import { Component, h, Prop, State, Watch } from '@stencil/core';
import uiStore from '@store/ui';
import { getOrder } from '@store/checkouts';

/**
 * @part base - The elements base wrapper.
 * @part count - The icon base wrapper.
 */
@Component({
  tag: 'sc-cart-button',
  styleUrl: 'sc-cart-button.scss',
  shadow: true,
})
export class ScCartButton {
  /** Is this open or closed? */
  @State() open: boolean = null;

  /** The order count */
  @State() count: number = 0;

  /** The icon to show. */
  @Prop() icon: string = 'shopping-bag';

  /** The form id to use for the cart. */
  @Prop({ reflect: true }) formId: string;

  /** Are we in test or live mode. */
  @Prop() mode: 'test' | 'live' = 'live';

  /** If the flyout menu should be visible. */
  @Prop() menuAlignment: 'left' | 'right' = 'left';

  order() {
    return getOrder(this.formId, this.mode);
  }

  @Watch('open')
  handleOpenChange() {
    uiStore.set('cart', { ...uiStore.state.cart, ...{ open: this.open } });
  }

  componentWillLoad() {
    this.open = !!uiStore.state.cart.open;
    this.count = uiStore.state.cart.count;
    uiStore.onChange('cart', cart => {
      this.open = cart.open;
      this.count = cart.count;
    });
  }

  render() {
    return (
      <div class={{ cart_button: true }} part="base">
        {!!this.count && (
          <span class={{ cart_button_count: true }} part="count">
            {this.count}
          </span>
        )}
        <div onClick={() => (this.open = !this.open)} class={{ cart_button_icon: true }}>
          {this.icon && <sc-icon name={this.icon}></sc-icon>}
        </div>
      </div>
    );
  }
}
