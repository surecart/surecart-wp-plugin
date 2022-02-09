import { Component, Prop, State, h, Method } from '@stencil/core';

@Component({
  tag: 'ce-menu-item',
  styleUrl: 'ce-menu-item.scss',
  shadow: true,
})
export class CEMenuItem {
  private menuItem: HTMLElement;

  @State() private hasFocus = false;

  /** Optional link to follow. */
  @Prop() href: string;

  /** Draws the item in a checked state. */
  @Prop({ reflect: true }) checked: boolean = false;

  /** A unique value to store in the menu item. This can be used as a way to identify menu items when selected. */
  @Prop() value: string = '';

  /** Draws the menu item in a disabled state. */
  @Prop({ reflect: true }) disabled: boolean = false;

  /** Sets focus on the button. */
  @Method('setFocus')
  async setFocus(options?: FocusOptions) {
    this.menuItem.focus(options);
  }

  /** Removes focus from the button. */
  @Method('setBlur')
  async setBlur() {
    this.menuItem.blur();
  }

  handleBlur() {
    this.hasFocus = false;
  }

  handleFocus() {
    this.hasFocus = true;
  }

  render() {
    const Tag = this.href ? 'a' : 'div';
    return (
      <Tag
        ref={el => (this.menuItem = el as HTMLElement)}
        part="base"
        class={{
          'menu-item': true,
          'menu-item--checked': this.checked,
          'menu-item--disabled': this.disabled,
          'menu-item--focused': this.hasFocus,
        }}
        href={this.href}
        role="menuitem"
        aria-disabled={this.disabled ? 'true' : 'false'}
        aria-checked={this.checked ? 'true' : 'false'}
        tabindex={!this.disabled ? '0' : undefined}
        onFocus={() => this.handleFocus()}
        onBlur={() => this.handleBlur()}
        onMouseEnter={() => this.handleFocus()}
        onMouseLeave={() => this.handleBlur()}
      >
        <span part="checked-icon" class="menu-item__check">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16">
            <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"></path>
          </svg>
        </span>
        <span part="prefix" class="menu-item__prefix">
          <slot name="prefix"></slot>
        </span>
        <span part="label" class="menu-item__label">
          <slot></slot>
        </span>
        <span part="suffix" class="menu-item__suffix">
          <slot name="suffix"></slot>
        </span>
      </Tag>
    );
  }
}
