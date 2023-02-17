import { Component, Prop, Event, EventEmitter, State, Element, Fragment, h } from '@stencil/core';
import { isRtl } from '../../../functions/page-align';

/**
 * @part base - The elements base wrapper.
 * @part label - The button label.
 * @part prefix - The button prefix.
 * @part suffix - The button suffix.
 * @part caret - The button caret.
 * @part spinner - The button spinner.
 */
@Component({
  tag: 'sc-button',
  styleUrl: 'sc-button.scss',
  shadow: true,
})
export class ScButton {
  @Element() button: HTMLElement | HTMLAnchorElement;

  @State() private hasFocus = false;
  @State() private hasLabel = false;
  @State() private hasPrefix = false;
  @State() private hasSuffix = false;

  /** The button's type. */
  @Prop({ reflect: true }) type: 'default' | 'primary' | 'success' | 'info' | 'warning' | 'danger' | 'text' | 'link' = 'default';

  /** The button's size. */
  @Prop({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium';

  /** Draws the button with a caret for use with dropdowns, popovers, etc. */
  @Prop({ reflect: true }) caret?: boolean = false;

  /** Draws the button full-width. */
  @Prop({ reflect: true }) full?: boolean = false;

  /** Disables the button. */
  @Prop({ reflect: true }) disabled?: boolean = false;

  /** Draws the button in a loading state. */
  @Prop({ reflect: true }) loading?: boolean = false;

  /** Draws an outlined button. */
  @Prop({ reflect: true }) outline?: boolean = false;

  /** Draws the button in a busy state. */
  @Prop({ reflect: true }) busy?: boolean = false;

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
  @Prop({ reflect: true }) href: string;

  /** Tells the browser where to open the link. Only used when `href` is set. */
  @Prop() target: '_blank' | '_parent' | '_self' | '_top';

  /** Tells the browser to download the linked file as this filename. Only used when `href` is set. */
  @Prop() download: string;

  /** Emitted when the button loses focus. */
  @Event() scBlur: EventEmitter<void>;

  /** Emitted when the button gains focus. */
  @Event() scFocus: EventEmitter<void>;

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
    this.scBlur.emit();
  }

  handleFocus() {
    this.hasFocus = true;
    this.scFocus.emit();
  }

  handleClick(event: MouseEvent) {
    if (this.disabled || this.loading || this.busy) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (this.submit) {
      this.submitForm();
    }
  }

  submitForm() {
    const form = this.button.closest('sc-form')?.shadowRoot?.querySelector('form') || this.button.closest('form');
    // Calling form.submit() seems to bypass the submit event and constraint validation. Instead, we can inject a
    // native submit button into the form, click it, then remove it to simulate a standard form submission.
    const button = document.createElement('button');
    if (form) {
      button.type = 'submit';
      button.style.position = 'absolute';
      button.style.width = '0';
      button.style.height = '0';
      button.style.clip = 'rect(0 0 0 0)';
      button.style.clipPath = 'inset(50%)';
      button.style.overflow = 'hidden';
      button.style.whiteSpace = 'nowrap';
      form.append(button);
      button.click();
      button.remove();
    }
  }

  render() {
    const Tag = this.href ? 'a' : 'button';

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
        {this.loading || this.busy ? <sc-spinner exportparts="base:spinner"></sc-spinner> : ''}
      </Fragment>
    );

    return (
      <Tag
        part="base"
        class={{
          'button': true,
          [`button--${this.type}`]: !!this.type,
          [`button--${this.size}`]: true,
          'button--caret': this.caret,
          'button--circle': this.circle,
          'button--disabled': this.disabled,
          'button--focused': this.hasFocus,
          'button--loading': this.loading,
          'button--busy': this.busy,
          'button--pill': this.pill,
          'button--standard': !this.outline,
          'button--outline': this.outline,
          'button--has-label': this.hasLabel,
          'button--has-prefix': this.hasPrefix,
          'button--has-suffix': this.hasSuffix,
          'button--is-rtl':isRtl()
        }}
        href={this.href}
        target={this.target}
        download={this.download}
        rel={this.target ? 'noreferrer noopener' : undefined}
        role="button"
        aria-disabled={this.disabled ? 'true' : 'false'}
        tabindex={this.disabled ? '-1' : '0'}
        disabled={this.disabled || this.busy}
        type={this.submit ? 'submit' : 'button'}
        name={this.name}
        value={this.value}
        onBlur={() => this.handleBlur()}
        onFocus={() => this.handleFocus()}
        onClick={e => this.handleClick(e)}
      >
        {interior}
      </Tag>
    );
  }
}
