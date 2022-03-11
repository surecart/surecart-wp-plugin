import { Component, Prop } from '@stencil/core';

@Component({
  tag: 'ce-format-bytes',
  styleUrl: 'ce-format-bytes.css',
  shadow: true,
})
export class CeFormatBytes {
  /** The locale to use when formatting the number. */
  @Prop() locale: string;

  /** The number to format in bytes. */
  @Prop() value: number = 0;

  /** The unit to display. */
  @Prop() unit: 'byte' | 'bit' = 'byte';

  /** Determines how to display the result, e.g. "100 bytes", "100 b", or "100b". */
  @Prop() display: 'long' | 'short' | 'narrow' = 'short';

  render() {
    if (isNaN(this.value)) {
      return '';
    }

    const bitPrefixes = ['', 'kilo', 'mega', 'giga', 'tera']; // petabit isn't a supported unit
    const bytePrefixes = ['', 'kilo', 'mega', 'giga', 'tera', 'peta'];
    const prefix = this.unit === 'bit' ? bitPrefixes : bytePrefixes;
    const index = Math.max(0, Math.min(Math.floor(Math.log10(this.value) / 3), prefix.length - 1));
    const unit = prefix[index] + this.unit;
    const valueToFormat = parseFloat((this.value / Math.pow(1000, index)).toPrecision(3));

    return new Intl.NumberFormat(this.locale, { style: 'unit', unit, unitDisplay: this.display } as any).format(valueToFormat);
  }
}
