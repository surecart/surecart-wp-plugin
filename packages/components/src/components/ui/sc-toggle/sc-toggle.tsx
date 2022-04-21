import { Component, Prop, h, Watch, Element, Event, EventEmitter } from '@stencil/core';
import { getAnimation, setDefaultAnimation } from '../../../functions/animation-registry';
import { animateTo, shimKeyframesHeightAuto, stopAnimations } from '../../../functions/animate';

@Component({
  tag: 'sc-toggle',
  styleUrl: 'sc-toggle.scss',
  shadow: true,
})
export class ScToggle {
  @Element() el: HTMLScToggleElement;
  private header: HTMLElement;
  private body: HTMLElement;

  /** Indicates whether or not the details is open. You can use this in lieu of the show/hide methods. */
  @Prop({ reflect: true }) open: boolean = false;

  /** The summary to show in the details header. If you need to display HTML, use the `summary` slot instead. */
  @Prop() summary: string;

  /** Disables the details so it can't be toggled. */
  @Prop({ reflect: true }) disabled: boolean = false;

  /** Is this a borderless toggle? */
  @Prop({ reflect: true }) borderless: boolean = false;

  /** Is this a shady */
  @Prop({ reflect: true }) shady: boolean = false;

  @Prop() showControl: boolean = false;

  /** Are these collapsible? */
  @Prop() collapsible: boolean = true;

  /** Show the toggle */
  @Event() scShow: EventEmitter<void>;

  /** Show the toggle */
  @Event() scHide: EventEmitter<void>;

  componentDidLoad() {
    this.body.hidden = !this.open;
    this.body.style.height = this.open ? 'auto' : '0';
  }

  /** Shows the details. */
  async show() {
    if (this.open || this.disabled) {
      return undefined;
    }
    this.open = true;
  }

  /** Hides the details */
  async hide() {
    if (!this.open || this.disabled || !this.collapsible) {
      return undefined;
    }
    this.open = false;
  }

  handleSummaryClick() {
    if (!this.disabled) {
      if (this.open) {
        this.hide();
      } else {
        this.show();
      }

      this.header.focus();
    }
  }

  handleSummaryKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();

      if (this.open) {
        this.hide();
      } else {
        this.show();
      }
    }

    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      event.preventDefault();
      this.hide();
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault();
      this.show();
    }
  }

  @Watch('open')
  async handleOpenChange() {
    if (this.open) {
      this.scShow.emit();
      await stopAnimations(this.body);
      this.body.hidden = false;
      const { keyframes, options } = getAnimation(this.el, 'details.show');
      await animateTo(this.body, shimKeyframesHeightAuto(keyframes, this.body.scrollHeight), options);
      this.body.style.height = 'auto';
    } else {
      this.scHide.emit();
      await stopAnimations(this.body);
      const { keyframes, options } = getAnimation(this.el, 'details.hide');
      await animateTo(this.body, shimKeyframesHeightAuto(keyframes, this.body.scrollHeight), options);
      this.body.hidden = true;
      this.body.style.height = 'auto';
    }
  }

  render() {
    return (
      <div
        part="base"
        class={{
          'details': true,
          'details--open': this.open,
          'details--disabled': this.disabled,
          'details--borderless': this.borderless,
          'details--shady': this.shady,
        }}
      >
        <header
          ref={el => (this.header = el as HTMLElement)}
          part="header"
          id="header"
          class="details__header"
          role="button"
          aria-expanded={this.open ? 'true' : 'false'}
          aria-controls="content"
          aria-disabled={this.disabled ? 'true' : 'false'}
          tabindex={this.disabled ? '-1' : '0'}
          onClick={() => this.handleSummaryClick()}
          onKeyDown={e => this.handleSummaryKeyDown(e)}
        >
          {this.showControl && (
            <span part="radio" class="details__radio">
              <svg viewBox="0 0 16 16">
                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <g fill="currentColor">
                    <circle cx="8" cy="8" r="3.42857143"></circle>
                  </g>
                </g>
              </svg>
            </span>
          )}

          <div part="summary" class="details__summary">
            <slot name="summary">{this.summary}</slot>
          </div>

          <span part="summary-icon" class="details__summary-icon">
            <slot name="icon">
              <sc-icon name="chevron-right"></sc-icon>
            </slot>
          </span>
        </header>

        <div class="details__body" ref={el => (this.body = el as HTMLElement)}>
          <div part="content" id="content" class="details__content" role="region" aria-labelledby="header">
            <slot></slot>
          </div>
        </div>
      </div>
    );
  }
}

setDefaultAnimation('details.show', {
  keyframes: [
    { height: '0', opacity: '0' },
    { height: 'auto', opacity: '1' },
  ],
  options: { duration: 250, easing: 'ease' },
});

setDefaultAnimation('details.hide', {
  keyframes: [
    { height: 'auto', opacity: '1' },
    { height: '0', opacity: '0' },
  ],
  options: { duration: 250, easing: 'ease' },
});
