/**
 * External dependencies.
 */
import { Component, Host, Prop, h, State } from '@stencil/core';
import { getUpsellRemainingTime, isUpsellExpired } from '@store/upsell/getters';
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

  /** The URL to redirect to when the countdown completes. */
  @State() redirectUrl: string = '/';

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
    setInterval(() => {
      this.timeRemaining = getUpsellRemainingTime(); // in seconds.
      const days = Math.floor(this.timeRemaining / (60 * 60 * 24));
      const hours = Math.floor((this.timeRemaining % (60 * 60 * 24)) / (60 * 60));
      const minutes = Math.floor((this.timeRemaining % (60 * 60)) / 60);
      const seconds = Math.floor(this.timeRemaining % 60);

      if (days > 0) {
        this.formattedTime = `${this.formatTimeUnit(days)}:${this.formatTimeUnit(hours)}:${this.formatTimeUnit(minutes)}:${this.formatTimeUnit(seconds)}`;
      } else if (hours > 0) {
        this.formattedTime = `${this.formatTimeUnit(hours)}:${this.formatTimeUnit(minutes)}:${this.formatTimeUnit(seconds)}`;
      } else if (minutes > 0) {
        this.formattedTime = `${this.formatTimeUnit(minutes)}:${this.formatTimeUnit(seconds)}`;
      } else {
        this.formattedTime = `00:${this.formatTimeUnit(seconds)}`;
      }
    }, 1000);
  }

  formatTimeUnit(unit: number): string {
    return unit < 10 ? `0${unit}` : `${unit}`;
  }

  render() {
    return (
      <Host>
        <span class="sc-upsell-countdown-badge">
          {this.showIcon && <sc-icon name="clock" />}
          <slot name="offer-expire-text" />
          <strong>{this.formattedTime}</strong>
        </span>
      </Host>
    );
  }
}
