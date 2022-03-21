import { Component, h, Prop, Event, EventEmitter, Element, State, Method } from '@stencil/core';
import { __ } from '@wordpress/i18n';
let id = 0;

@Component({
  tag: 'sc-tab',
  styleUrl: 'sc-tab.scss',
  shadow: true,
})
export class ScTab {
  @Element() el: HTMLElement;
  private tab: HTMLDivElement;

  private componentId = `tab-${++id}`;

  /** The name of the tab panel the tab will control. The panel must be located in the same tab group. */
  @Prop({ reflect: true }) panel = '';

  @Prop({ reflect: true }) href: string;

  /** Draws the tab in an active state. */
  @Prop({ reflect: true }) active: boolean = false;

  /** Draws the tab in a disabled state. */
  @Prop({ reflect: true }) disabled = false;

  @Prop() count: string;

  @State() private hasPrefix = false;
  @State() private hasSuffix = false;

  /** Close event */
  @Event() scClose: EventEmitter<void>;

  /** Sets focus to the tab. */
  @Method()
  async triggerFocus(options?: FocusOptions) {
    this.tab.focus(options);
  }

  /** Removes focus from the tab. */
  @Method()
  async triggerBlur() {
    this.tab.blur();
  }

  handleSlotChange() {
    this.hasPrefix = !!this.el.querySelector('[slot="prefix"]');
    this.hasSuffix = !!this.el.querySelector('[slot="suffix"]');
  }

  render() {
    // If the user didn't provide an ID, we'll set one so we can link tabs and tab panels with aria labels
    this.el.id = this.el.id || this.componentId;
    const Tag = this.href ? 'a' : 'div';

    return (
      <Tag
        part={`base ${this.active ? `active` : ``}`}
        href={this.href}
        class={{
          'tab': true,
          'tab--active': this.active,
          'tab--disabled': this.disabled,
          'tab--has-prefix': this.hasPrefix,
          'tab--has-suffix': this.hasSuffix,
        }}
        ref={el => (this.tab = el)}
        role="tab"
        aria-disabled={this.disabled ? 'true' : 'false'}
        aria-selected={this.active ? 'true' : 'false'}
        tabindex={this.disabled || !this.active ? '-1' : '0'}
      >
        <span part="prefix" class="tab__prefix">
          <slot onSlotchange={() => this.handleSlotChange()} name="prefix"></slot>
        </span>
        <div class="tab__content" part="content">
          <slot />
        </div>
        <span part="suffix" class="tab__suffix">
          <slot onSlotchange={() => this.handleSlotChange()} name="suffix"></slot>
        </span>
        <slot name="suffix">
          {!!this.count && (
            <div class="tab__counter" part="counter">
              {this.count}
            </div>
          )}
        </slot>
      </Tag>
    );
  }
}
