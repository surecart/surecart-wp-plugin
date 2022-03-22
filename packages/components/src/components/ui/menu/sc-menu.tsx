import { Component, h, Event, EventEmitter, Element } from '@stencil/core';
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
      const item = this.getActiveItem();
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
      const selectedItem = this.getActiveItem();
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

        this.setActiveItem(this.items[index]);

        return;
      }
    }
  }

  /** Sets the active item */
  setActiveItem(item: HTMLScMenuItemElement) {
    item.setFocus();
  }

  /** Get the active item */
  getActiveItem() {
    // TODO: Check if this works
    return this.el.querySelector('.menu-item--focused') as HTMLScMenuItemElement;
  }

  /** Sync slotted items with internal state */
  syncItems() {
    const slotted = this.el.shadowRoot.querySelector('slot') as HTMLSlotElement;
    this.items = slotted.assignedNodes().filter(node => {
      return node.nodeName === 'sc-menu-item';
    }) as HTMLScMenuItemElement[];
  }

  /** Handle items change in slot */
  handleSlotChange() {
    this.syncItems();
  }

  render() {
    return (
      <div part="base" class="menu" role="menu" tabindex="0">
        <slot onSlotchange={() => this.handleSlotChange()}></slot>
      </div>
    );
  }
}
