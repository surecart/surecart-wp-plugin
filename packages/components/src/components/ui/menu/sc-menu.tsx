import { Component, h, Event, EventEmitter, Element, Method } from '@stencil/core';
@Component({
  tag: 'sc-menu',
  styleUrl: 'sc-menu.scss',
  shadow: true,
})
export class ScMenu {
  @Element() el: HTMLElement;
  @Event() scSelect: EventEmitter<{ item: HTMLScMenuItemElement }>;
  private items: HTMLScMenuItemElement[] = [];

  /** TODO: Click test */
  handleClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const item = target.closest('sc-menu-item') as HTMLScMenuItemElement;

    if (item && !item.disabled) {
      this.scSelect.emit({ item });
    }
  }

  /** TODO: Keydown Test */
  handleKeyDown(event: KeyboardEvent) {
    // Make a selection when pressing enter
    if (event.key === 'Enter') {
      const item = this.getCurrentItem();
      event.preventDefault();

      if (item) {
        this.scSelect.emit({ item });
      }
    }

    // Prevent scrolling when space is pressed
    if (event.key === ' ') {
      event.preventDefault();
    }

    // Move the selection when pressing down or up
    if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      const selectedItem = this.getCurrentItem();
      let index = selectedItem ? this.items.indexOf(selectedItem) : 0;

      if (this.items.length) {
        event.preventDefault();

        if (event.key === 'ArrowDown') {
          index++;
        } else if (event.key === 'ArrowUp') {
          index--;
        } else if (event.key === 'Home') {
          index = 0;
        } else if (event.key === 'End') {
          index = this.items.length - 1;
        }

        if (index < 0) index = 0;
        if (index > this.items.length - 1) index = this.items.length - 1;

        this.setCurrentItem(this.items[index]);

        return;
      }
    }
  }

  /** Get the active item */
  getCurrentItem() {
    return this.items.find(i => i.getAttribute('tabindex') === '0');
  }

  /**
   * @internal Sets the current menu item to the specified element. This sets `tabindex="0"` on the target element and
   * `tabindex="-1"` to all other items. This method must be called prior to setting focus on a menu item.
   */
  @Method()
  async setCurrentItem(item: HTMLScMenuItemElement) {
    const activeItem = item.disabled ? this.items[0] : item;
    // Update tab indexes
    this.items.forEach(i => {
      i.setAttribute('tabindex', i === activeItem ? '0' : '-1');
    });
  }

  /** Sync slotted items with internal state */
  syncItems() {
    const slottedElements = (this.el.shadowRoot.querySelector('slot') as HTMLSlotElement).assignedElements({ flatten: true });
    this.items = slottedElements.filter(node => {
      return node.nodeName === 'sc-menu-item';
    }) as HTMLScMenuItemElement[];
  }

  /** Handle items change in slot */
  handleSlotChange() {
    this.syncItems();
  }

  render() {
    return (
      <div part="base" class="menu" role="menu" tabindex="0" onKeyDown={e => this.handleKeyDown(e)}>
        <slot onSlotchange={() => this.handleSlotChange()}></slot>
      </div>
    );
  }
}
