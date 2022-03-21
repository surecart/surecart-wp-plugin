import { Component, Prop } from '@stencil/core';
import { __, _n, sprintf } from '@wordpress/i18n';

@Component({
  tag: 'ce-format-interval',
  shadow: false,
})
export class CeFormatNumber {
  /** The number to format. */
  @Prop() value: number = 0;

  @Prop() interval: string = '';

  @Prop() every: string = __('every', 'surecart');

  @Prop() fallback: string = __('once', 'surecart');

  render() {
    switch (this.interval) {
      case 'day':
        return `${this.every} ${sprintf(_n('day', '%d days', this.value, 'surecart'), this.value)}`;
      case 'week':
        return `${this.every} ${sprintf(_n('week', '%d weeks', this.value, 'surecart'), this.value)}`;
      case 'month':
        return `${this.every} ${sprintf(_n('month', '%d months', this.value, 'surecart'), this.value)}`;
      case 'year':
        return `${this.every} ${sprintf(_n('year', '%d years', this.value, 'surecart'), this.value)}`;
      default:
        return this.fallback;
    }
  }
}
