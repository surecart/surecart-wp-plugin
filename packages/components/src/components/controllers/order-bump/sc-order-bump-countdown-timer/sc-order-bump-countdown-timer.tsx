/**
 * External dependencies.
 */
import { Component, Host, Prop, h, State, Listen } from '@stencil/core';

@Component({
  tag: 'sc-order-bump-countdown-timer',
  styleUrl: 'sc-order-bump-countdown-timer.css',
  shadow: true,
})
export class ScOrderBumpCountdownTimer {
  /** The time remaining in seconds. */
  @State() timeRemaining: number = 600; // 10 minutes

  /** The formatted time remaining. */
  @State() formattedTime: string;

  /** The URL to redirect to when the countdown completes. */
  @State() redirectUrl: string = '/';

  /** Whether to show the icon. */
  @Prop() showIcon: boolean = true;

  // Use local storage key for storing countdown time
  localStorageKey = 'countdownTime';

  constructor() {
    this.loadTimeFromLocalStorage();
    this.startCountdown();
  }

  componentDidLoad() {
    this.updateCountdown();
  }

  loadTimeFromLocalStorage() {
    const savedTime = localStorage.getItem(this.localStorageKey);
    this.timeRemaining = savedTime ? parseInt(savedTime, 10) : 0;
  }

  startCountdown() {
    setInterval(() => {
      if (this.timeRemaining > 0) {
        this.timeRemaining -= 1;
        this.saveTimeToLocalStorage();
      } else {
        this.handleCountdownComplete();
      }
    }, 1000);
  }

  updateCountdown() {
    setInterval(() => {
      const days = Math.floor(this.timeRemaining / (60 * 60 * 24));
      const hours = Math.floor((this.timeRemaining % (60 * 60 * 24)) / (60 * 60));
      const minutes = Math.floor((this.timeRemaining % (60 * 60)) / 60);
      const seconds = this.timeRemaining % 60;

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

  saveTimeToLocalStorage() {
    localStorage.setItem(this.localStorageKey, this.timeRemaining.toString());
  }

  handleCountdownComplete() {
    if (!!this.redirectUrl) {
      window.location.href = this.redirectUrl;
    }
  }

  @Listen('resetCountdown')
  handleResetCountdown() {
    // Handle the event to reset the countdown
    this.timeRemaining = 600; // Set the desired countdown time
    this.saveTimeToLocalStorage();
  }

  render() {
    return (
      <Host>
        <span class="sc-countdown-badge">
          {this.showIcon && <sc-icon name="clock" />}
          <slot name="offer-expire-text" />
          <strong>{this.formattedTime}</strong>
        </span>
      </Host>
    );
  }
}
