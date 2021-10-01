import { Component, Prop } from '@stencil/core';
import { maybeConvertAmount } from './functions/utils';

@Component({
  tag: 'ce-format-number',
  shadow: false,
})
export class CeFormatNumber {
  /** The number to format. */
  @Prop() value: number = 0;

  /** The locale to use when formatting the number. */
  @Prop() locale: string;

  /** The formatting style to use. */
  @Prop() type: 'currency' | 'decimal' | 'percent' = 'decimal';

  /** Turns off grouping separators. */
  @Prop({ attribute: 'no-grouping' }) noGrouping: boolean = false;

  /** The currency to use when formatting. Must be an ISO 4217 currency code such as `USD` or `EUR`. */
  @Prop() currency = 'USD';

  /** How to display the currency. */
  @Prop() currencyDisplay: 'symbol' | 'narrowSymbol' | 'code' | 'name' = 'symbol';

  /** The minimum number of integer digits to use. Possible values are 1 - 21. */
  @Prop() minimumIntegerDigits: number;

  /** The minimum number of fraction digits to use. Possible values are 0 - 20. */
  @Prop() minimumFractionDigits: number;

  /** The maximum number of fraction digits to use. Possible values are 0 - 20. */
  @Prop() maximumFractionDigits: number;

  /** The minimum number of significant digits to use. Possible values are 1 - 21. */
  @Prop() minimumSignificantDigits: number;

  /** The maximum number of significant digits to use,. Possible values are 1 - 21. */
  @Prop() maximumSignificantDigits: number;

  @Prop() noConvert: boolean;

  render() {
    if (isNaN(this.value)) {
      return '';
    }
    return new Intl.NumberFormat(this.locale, {
      style: this.type,
      currency: this.currency.toUpperCase(),
      currencyDisplay: this.currencyDisplay,
      useGrouping: !this.noGrouping,
      minimumIntegerDigits: this.minimumIntegerDigits,
      minimumFractionDigits: this.minimumFractionDigits,
      maximumFractionDigits: this.maximumFractionDigits,
      minimumSignificantDigits: this.minimumSignificantDigits,
      maximumSignificantDigits: this.maximumSignificantDigits,
    }).format(this.noConvert ? this.value : maybeConvertAmount(this.value, this.currency.toUpperCase()));
  }
}
