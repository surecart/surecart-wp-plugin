import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'ce-cc-logo',
  styleUrl: 'ce-cc-logo.css',
  shadow: true,
})
export class CeCcLogo {
  @Prop() brand: string;
  renderLogo() {
    if (['visa', 'mastercard', 'amex', 'discover', 'diners', 'jcb', 'unionpay'].includes(this.brand)) {
      return <ce-icon name={this.brand} style={{ '--height': '0.63em' }}></ce-icon>;
    }
    return <ce-icon name="credit-card" style={{ '--height': '0.63em' }}></ce-icon>;
  }
  render() {
    return (
      <div class="cc-logo" part="base">
        {this.renderLogo()}
      </div>
    );
  }
}
