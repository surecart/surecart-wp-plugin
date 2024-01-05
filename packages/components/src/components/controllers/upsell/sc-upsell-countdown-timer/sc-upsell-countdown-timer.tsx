/**
 * External dependencies.
 */
import { Component, Host, Prop, h, State } from '@stencil/core';
import { getFormattedRemainingTime, isUpsellExpired } from '@store/upsell/getters';
import { redirectUpsell } from '@store/upsell/mutations';

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
    this.maybeRedirectUpsell();
  }

  maybeRedirectUpsell() {
    if (isUpsellExpired()) {
      redirectUpsell();
    }
  }

  updateCountdown() {
    this.formattedTime = getFormattedRemainingTime();
    setInterval(() => {
      this.formattedTime = getFormattedRemainingTime();
    }, 1000);
  }

  render() {
    return (
      <Host>
        <span class="sc-upsell-countdown-badge">
          {this.showIcon && <sc-icon name="clock" />}
          <span>
            <slot name="offer-expire-text" /> <strong>{this.formattedTime}</strong>
          </span>
        </span>
      </Host>
    );
  }
}
