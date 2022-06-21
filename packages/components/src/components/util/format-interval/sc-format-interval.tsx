import { Component, Prop } from '@stencil/core';
import { __, _n } from '@wordpress/i18n';
import { translateInterval } from '../../../functions/price';

@Component({
  tag: 'sc-format-interval',
  shadow: false,
})
export class ScFormatInterval {
  /** The number to format. */
  @Prop() value: number = 0;

  @Prop() interval: string = '';

  @Prop() every: string = '/';

  @Prop() fallback: string = '';

  render() {
    return translateInterval(this.value, this.interval, ` ${this.every}`, this.fallback);
  }
}
