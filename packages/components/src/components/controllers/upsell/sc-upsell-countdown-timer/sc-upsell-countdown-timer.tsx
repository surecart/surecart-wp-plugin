/**
 * External dependencies.
 */
import { Component, Host, Prop, h, State } from '@stencil/core';
import { getFormattedRemainingTime } from '@store/upsell/getters';

@Component({
  tag: 'sc-upsell-countdown-timer',
  styleUrl: 'sc-upsell-countdown-timer.css',
  shadow: true,
})
export class ScUpsellCountdownTimer {
  /** The time remaining in seconds. */
  @State() timeRemaining: number = Infinity; // Initial time is many, would be updated later.

  /** The formatted time remaining. */
  @State() formattedTime: string;

  /** Whether to show the icon. */
  @Prop() showIcon: boolean = true;

  componentDidLoad() {
    this.updateCountdown();
  }

  updateCountdown() {
    this.formattedTime = getFormattedRemainingTime();
    setInterval(() => {
      this.formattedTime = getFormattedRemainingTime();
    }, 1000);
  }

  render() {
    return (
      <Host
        role="timer"
        class={{
          'sc-upsell-countdown-timer': true,
        }}
      >
        {this.showIcon && <sc-icon name="clock" />}
        <span>
          <slot name="offer-expire-text" /> <strong>{this.formattedTime}</strong>
        </span>
      </Host>
    );
  }
}
