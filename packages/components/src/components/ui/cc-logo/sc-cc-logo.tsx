import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'sc-cc-logo',
  styleUrl: 'sc-cc-logo.css',
  shadow: true,
})
export class ScCcLogo {
  @Prop() brand: string;
  renderLogo() {
    if (['visa', 'mastercard', 'amex', 'discover', 'diners', 'jcb', 'unionpay'].includes(this.brand)) {
      return <sc-icon name={this.brand} style={{ '--height': '0.63em' }}></sc-icon>;
    }
    return <sc-icon name="credit-card" style={{ '--height': '0.63em' }}></sc-icon>;
  }
  render() {
    return (
      <div class="cc-logo" part="base">
        {this.renderLogo()}
      </div>
    );
  }
}
