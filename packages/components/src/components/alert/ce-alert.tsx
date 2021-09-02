import { Component, Prop, Method, State, Event, EventEmitter, Watch, h } from '@stencil/core';

@Component({
  tag: 'ce-alert',
  styleUrl: 'ce-alert.scss',
  shadow: true,
})
export class CeAlert {
  /** Indicates whether or not the alert is open. You can use this in lieu of the show/hide methods. */
  @Prop({ reflect: true, mutable: true }) open: boolean = false;

  /** Makes the alert closable. */
  @Prop({ reflect: true }) closable: boolean = false;

  /** The type of alert. */
  @Prop({ reflect: true }) type: 'primary' | 'success' | 'info' | 'warning' | 'danger' = 'primary';

  /**
   * The length of time, in milliseconds, the alert will show before closing itself. If the user interacts with
   * the alert before it closes (e.g. moves the mouse over it), the timer will restart. Defaults to `Infinity`.
   */
  @Prop() duration: number = Infinity;

  @State() autoHideTimeout: any;

  /** When alert is hidden */
  @Event() ceHide: EventEmitter<void>;

  /** When alert is shown */
  @Event() ceShow: EventEmitter<void>;

  /** Shows the alert. */
  @Method()
  async show() {
    if (this.open) {
      return;
    }

    this.open = true;
  }

  /** Hides the alert */
  @Method()
  async hide() {
    if (!this.open) {
      return;
    }
    this.open = false;
  }

  restartAutoHide() {
    clearTimeout(this.autoHideTimeout);
    if (this.open && this.duration < Infinity) {
      this.autoHideTimeout = setTimeout(() => this.hide(), this.duration);
    }
  }

  handleMouseMove() {
    this.restartAutoHide();
  }

  handleCloseClick() {
    this.hide();
  }

  /** Emit event when showing or hiding changes */
  @Watch('open')
  handleOpenChange(val) {
    console.log(val);
    val ? this.ceShow.emit() : this.ceHide.emit();
  }

  icon() {
    return (
      <svg x-description="Heroicon name: solid/x-circle" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path
          fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clip-rule="evenodd"
        ></path>
      </svg>
    );
  }

  render() {
    return (
      <div
        class={{
          'alert': true,
          'alert--primary': this.type === 'primary',
          'alert--success': this.type === 'success',
          'alert--info': this.type === 'info',
          'alert--warning': this.type === 'warning',
          'alert--danger': this.type === 'danger',
        }}
        part="base"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        aria-hidden={this.open ? 'false' : 'true'}
        hidden={this.open ? false : true}
        onMouseMove={() => this.handleMouseMove()}
      >
        <div class="alert__icon" part="icon">
          <slot name="icon">{this.icon()}</slot>
        </div>
        <div class="alert__text" part="text">
          <div class="alert__title" part="title">
            <slot name="title" />
          </div>
          <div class="alert__message" part="message">
            <slot />
          </div>
        </div>
        {this.closable && (
          <span class="alert__close" onClick={() => this.handleCloseClick()}>
            <span class="sr-only">Dismiss</span>
            <svg class="h-5 w-5" x-description="Heroicon name: solid/x" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </span>
        )}
      </div>
    );
  }
}
