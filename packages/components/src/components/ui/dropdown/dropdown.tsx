import { Component, Element, Prop, Event, EventEmitter, Watch, State, h } from '@stencil/core';
import { CEMenu } from '../menu/ce-menu';
import { clickOutside } from '../../../functions/click';

@Component({
  tag: 'ce-dropdown',
  styleUrl: 'dropdown.scss',
  shadow: true,
})
export class CEDropdown {
  @Element() el: HTMLDivElement;
  private panel?: HTMLElement;

  @Prop() clickEl?: HTMLElement;

  /** Indicates whether or not the dropdown is open. You can use this in lieu of the show/hide methods. */
  @Prop({ reflect: true, mutable: true }) open?: boolean = false;

  /** The placement of the dropdown panel */
  @Prop() position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

  /** Determines whether the dropdown should hide when a menu item is selected */
  @Prop({ attribute: 'close-on-select', reflect: true }) closeOnSelect: boolean = true;

  /** Emitted when the dropdown opens. Calling `event.preventDefault()` will prevent it from being opened. */
  @Event() ceShow: EventEmitter<void>;

  /** Emitted when the dropdown closes. Calling `event.preventDefault()` will prevent it from being closed. */
  @Event() ceHide: EventEmitter<void>;

  /* Internal visible state */
  @State() isVisible: boolean;

  @Watch('open')
  handleOpenChange() {
    this.open ? this.show() : this.hide();
  }

  show() {
    // Prevent subsequent calls to the method, whether manually or triggered by the `open` watcher
    if (this.isVisible) {
      return;
    }

    this.isVisible = true;
    this.open = true;
    this.panel.focus();
    this.ceShow.emit();
  }

  hide() {
    // Prevent subsequent calls to the method, whether manually or triggered by the `open` watcher
    if (!this.isVisible) {
      return;
    }

    this.isVisible = false;
    this.open = false;
    this.ceHide.emit();
  }

  handleClick() {
    if (this.closeOnSelect) {
      this.open = false;
    }
  }

  /* Get the slotted menu */
  getMenu() {
    let slotted = this.el.shadowRoot.querySelector('slot') as HTMLSlotElement;
    return slotted.assignedNodes().find(node => {
      return node.nodeName === 'ce-menu';
    }) as unknown as CEMenu;
  }

  componentDidLoad() {
    // close when clicked outside
    clickOutside(this.clickEl || this.el, () => {
      this.open = false;
    });
  }

  render() {
    return (
      <div
        class={{
          'dropdown': true,
          'dropdown--open': this.open,
        }}
      >
        <span
          part="trigger"
          class="dropdown__trigger"
          onClick={() => {
            this.open ? this.hide() : this.show();
          }}
          aria-expanded="true"
          aria-haspopup="true"
        >
          <slot name="trigger"></slot>
        </span>

        <div
          part="panel"
          class={{
            'dropdown__panel': true,
            'position--top-left': this.position === 'top-left',
            'position--top-right': this.position === 'top-right',
            'position--bottom-left': this.position === 'bottom-left',
            'position--bottom-right': this.position === 'bottom-right',
          }}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabindex="-1"
          onClick={() => this.handleClick()}
          ref={el => (this.panel = el as HTMLElement)}
        >
          <slot></slot>
        </div>
      </div>
    );
  }
}
