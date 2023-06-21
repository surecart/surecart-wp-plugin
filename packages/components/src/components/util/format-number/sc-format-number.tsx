import { Component, Prop } from '@stencil/core';
import { maybeConvertAmount } from '../../../functions/currency';

//TODO: Remove this when unit types are supported
interface NumberFormatOptionsWithUnit extends Intl.NumberFormatOptions {
  unit: string;
  unitDisplay: 'long' | 'short' | 'narrow';
}

const UNIT_TYPES = {
  kg: 'kilogram',
  lb: 'pound',
  g: 'gram',
  oz: 'ounce',
};

@Component({
  tag: 'sc-format-number',
  shadow: false,
})
export class ScFormatNumber {
  /** The number to format. */
  @Prop() value: number = 0;

  /** The locale to use when formatting the number. */
  @Prop({ mutable: true }) locale: string;

  /** The formatting style to use. */
  @Prop() type: 'currency' | 'decimal' | 'percent' | 'unit' = 'decimal';

  /** Turns off grouping separators. */
  @Prop({ attribute: 'no-grouping' }) noGrouping: boolean = false;

  /** The currency to use when formatting. Must be an ISO 4217 currency code such as `USD` or `EUR`. */
  @Prop() currency = 'USD';

  /** How to display the currency. */
  @Prop() currencyDisplay: 'symbol' | 'narrowSymbol' | 'code' | 'name' = 'symbol';

  /** The minimum number of integer digits to use. Possible values are 1 - 21. */
  @Prop() minimumIntegerDigits: number;

  /** The minimum number of fraction digits to use. Possible values are 0 - 20. */
  @Prop() minimumFractionDigits: number = null;

  /** The maximum number of fraction digits to use. Possible values are 0 - 20. */
  @Prop() maximumFractionDigits: number;

  /** The minimum number of significant digits to use. Possible values are 1 - 21. */
  @Prop() minimumSignificantDigits: number;

  /** The maximum number of significant digits to use,. Possible values are 1 - 21. */
  @Prop() maximumSignificantDigits: number;

  /** Should we convert */
  @Prop() noConvert: boolean;

  /** The unit to use when formatting.  */
  @Prop() unit: string = 'lb';

  render() {
    if (isNaN(this.value)) {
      return '';
    }
    const lang = navigator.language || (navigator as any)?.browserLanguage || (navigator.languages || ['en'])[0];

    // maybe convert zero decimal currencies.
    const value = this.noConvert ? this.value : maybeConvertAmount(this.value, this.currency.toUpperCase());

    // decide how many decimal places to use.
    const minimumFractionDigits = value % 1 == 0 ? 0 : 2;

    return new Intl.NumberFormat(this.locale || lang, {
      style: this.type,
      currency: this.currency.toUpperCase(),
      currencyDisplay: this.currencyDisplay,
      useGrouping: !this.noGrouping,
      minimumIntegerDigits: this.minimumIntegerDigits,
      minimumFractionDigits: this.minimumFractionDigits !== null ? this.minimumFractionDigits : minimumFractionDigits,
      maximumFractionDigits: this.maximumFractionDigits,
      minimumSignificantDigits: this.minimumSignificantDigits,
      maximumSignificantDigits: this.maximumSignificantDigits,
      unit: UNIT_TYPES[this.unit],
    } as NumberFormatOptionsWithUnit).format(this.noConvert ? this.value : maybeConvertAmount(this.value, this.currency.toUpperCase()));
  }
}
