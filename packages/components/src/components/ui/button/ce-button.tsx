import { Component, Prop, Event, EventEmitter, State, Element, h } from '@stencil/core';
import Fragment from 'stencil-fragment';

@Component({
  tag: 'ce-button',
  styleUrl: 'ce-button.scss',
  shadow: true,
})
export class CEButton {
  @Element() button: HTMLElement | HTMLAnchorElement;

  @State() private hasFocus = false;
  @State() private hasLabel = false;
  @State() private hasPrefix = false;
  @State() private hasSuffix = false;

  /** The button's type. */
  @Prop({ reflect: true }) type: 'default' | 'primary' | 'success' | 'info' | 'warning' | 'danger' | 'text' = 'default';

  /** The button's size. */
  @Prop({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium';

  /** Draws the button with a caret for use with dropdowns, popovers, etc. */
  @Prop({ reflect: true }) caret?: boolean = false;

  /** Draws the button with a caret for use with dropdowns, popovers, etc. */
  @Prop({ reflect: true }) full?: boolean = false;

  /** Disables the button. */
  @Prop({ reflect: true }) disabled?: boolean = false;

  /** Draws the button in a loading state. */
  @Prop({ reflect: true }) loading?: boolean = false;

  /** Draws a pill-style button with rounded edges. */
  @Prop({ reflect: true }) pill?: boolean = false;

  /** Draws a circle button. */
  @Prop({ reflect: true }) circle?: boolean = false;

  /** Indicates if activating the button should submit the form. Ignored when `href` is set. */
  @Prop({ reflect: true }) submit?: boolean = false;

  /** An optional name for the button. Ignored when `href` is set. */
  @Prop() name: string;

  /** An optional value for the button. Ignored when `href` is set. */
  @Prop() value: string;

  /** When set, the underlying button will be rendered as an `<a>` with this `href` instead of a `<button>`. */
  @Prop() href: string;

  /** Tells the browser where to open the link. Only used when `href` is set. */
  @Prop() target: '_blank' | '_parent' | '_self' | '_top';

  /** Tells the browser to download the linked file as this filename. Only used when `href` is set. */
  @Prop() download: string;

  /** Emitted when the button loses focus. */
  @Event() ceBlur: EventEmitter<void>;

  /** Emitted when the button gains focus. */
  @Event() ceFocus: EventEmitter<void>;

  componentWillLoad() {
    this.handleSlotChange();
  }

  /** Simulates a click on the button. */
  click() {
    this.button.click();
  }

  /** Sets focus on the button. */
  focus(options?: FocusOptions) {
    this.button.focus(options);
  }

  /** Removes focus from the button. */
  blur() {
    this.button.blur();
  }

  handleSlotChange() {
    this.hasLabel = !!this.button.children;
    this.hasPrefix = !!this.button.querySelector('[slot="prefix"]');
    this.hasSuffix = !!this.button.querySelector('[slot="suffix"]');
  }

  handleBlur() {
    this.hasFocus = false;
    this.ceBlur.emit();
  }

  handleFocus() {
    this.hasFocus = true;
    this.ceFocus.emit();
  }

  handleClick(event: MouseEvent) {
    if (this.disabled || this.loading) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  render() {
    const isLink = this.href ? true : false;

    const interior = (
      <Fragment>
        <span part="prefix" class="button__prefix">
          <slot onSlotchange={() => this.handleSlotChange()} name="prefix"></slot>
        </span>
        <span part="label" class="button__label">
          <slot onSlotchange={() => this.handleSlotChange()}></slot>
        </span>
        <span part="suffix" class="button__suffix">
          <slot onSlotchange={() => this.handleSlotChange()} name="suffix"></slot>
        </span>
        {this.caret ? (
          <span part="caret" class="button__caret">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </span>
        ) : (
          ''
        )}
        {this.loading ? <ce-spinner></ce-spinner> : ''}
      </Fragment>
    );

    const button = (
      <button
        part="base"
        class={{
          'button': true,
          'button--default': this.type === 'default',
          'button--primary': this.type === 'primary',
          'button--success': this.type === 'success',
          'button--info': this.type === 'info',
          'button--warning': this.type === 'warning',
          'button--danger': this.type === 'danger',
          'button--text': this.type === 'text',
          'button--small': this.size === 'small',
          'button--medium': this.size === 'medium',
          'button--large': this.size === 'large',
          'button--caret': this.caret,
          'button--circle': this.circle,
          'button--disabled': this.disabled,
          'button--focused': this.hasFocus,
          'button--loading': this.loading,
          'button--pill': this.pill,
          'button--has-label': this.hasLabel,
          'button--has-prefix': this.hasPrefix,
          'button--has-suffix': this.hasSuffix,
        }}
        disabled={this.disabled}
        type={this.submit ? 'submit' : 'button'}
        name={this.name}
        value={this.value}
        onBlur={() => this.handleBlur()}
        onFocus={() => this.handleFocus()}
        onClick={e => this.handleClick(e)}
      >
        {interior}
      </button>
    );

    const link = (
      <a
        part="base"
        class={{
          'button': true,
          'button--default': this.type === 'default',
          'button--primary': this.type === 'primary',
          'button--success': this.type === 'success',
          'button--info': this.type === 'info',
          'button--warning': this.type === 'warning',
          'button--danger': this.type === 'danger',
          'button--text': this.type === 'text',
          'button--small': this.size === 'small',
          'button--medium': this.size === 'medium',
          'button--large': this.size === 'large',
          'button--caret': this.caret,
          'button--circle': this.circle,
          'button--disabled': this.disabled,
          'button--focused': this.hasFocus,
          'button--loading': this.loading,
          'button--pill': this.pill,
          'button--has-label': this.hasLabel,
          'button--has-prefix': this.hasPrefix,
          'button--has-suffix': this.hasSuffix,
        }}
        href={this.href}
        target={this.target}
        download={this.download}
        rel={this.target ? 'noreferrer noopener' : undefined}
        role="button"
        aria-disabled={this.disabled ? 'true' : 'false'}
        tabindex={this.disabled ? '-1' : '0'}
        onBlur={() => this.handleBlur()}
        onFocus={() => this.handleFocus()}
        onClick={e => this.handleClick(e)}
      >
        {interior}
      </a>
    );

    return isLink ? link : button;
  }
}
