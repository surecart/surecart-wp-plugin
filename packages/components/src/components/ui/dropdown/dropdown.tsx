import { Component, Element, Prop, Event, EventEmitter, Watch, State, h } from '@stencil/core';
import { ScMenu } from '../menu/sc-menu';

@Component({
  tag: 'sc-dropdown',
  styleUrl: 'dropdown.scss',
  shadow: true,
})
export class ScDropdown {
  @Element() el: HTMLDivElement;
  private panel?: HTMLElement;

  @Prop() clickEl?: HTMLElement;

  /** Is this disabled. */
  @Prop() disabled: boolean;

  /** Indicates whether or not the dropdown is open. You can use this in lieu of the show/hide methods. */
  @Prop({ reflect: true, mutable: true }) open?: boolean = false;

  /** The placement of the dropdown panel */
  @Prop() position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

  /** Determines whether the dropdown should hide when a menu item is selected */
  @Prop({ attribute: 'close-on-select', reflect: true }) closeOnSelect: boolean = true;

  /** Emitted when the dropdown opens. Calling `event.preventDefault()` will prevent it from being opened. */
  @Event() scShow: EventEmitter<void>;

  /** Emitted when the dropdown closes. Calling `event.preventDefault()` will prevent it from being closed. */
  @Event() scHide: EventEmitter<void>;

  /* Internal visible state */
  @State() isVisible: boolean;

  @Watch('open')
  handleOpenChange() {
    this.open ? this.show() : this.hide();
  }

  handleOutsideClick(evt) {
    const path = evt.composedPath();
    if (
      !path.some(item => {
        return item === this.el;
      })
    ) {
      this.open = false;
    }
  }

  show() {
    // Prevent subsequent calls to the method, whether manually or triggered by the `open` watcher
    if (this.isVisible) {
      return;
    }

    this.isVisible = true;
    this.open = true;
    this.panel.focus();
    this.scShow.emit();
  }

  hide() {
    // Prevent subsequent calls to the method, whether manually or triggered by the `open` watcher
    if (!this.isVisible) {
      return;
    }

    this.isVisible = false;
    this.open = false;
    this.scHide.emit();
  }

  handleClick(e) {
    if (this.closeOnSelect) {
      const path = e.composedPath();
      if (
        path.some(item => {
          return item.classList && item.classList.contains('menu-item');
        })
      ) {
        this.open = false;
      }
    }
  }

  componentWillLoad() {
    document.addEventListener('mousedown', evt => this.handleOutsideClick(evt));
  }

  /* Get the slotted menu */
  getMenu() {
    let slotted = this.el.shadowRoot.querySelector('slot') as HTMLSlotElement;
    return slotted.assignedNodes().find(node => {
      return node.nodeName === 'sc-menu';
    }) as unknown as ScMenu;
  }

  render() {
    return (
      <div
        class={{
          'dropdown': true,
          'dropdown--open': this.open,
          'dropdown--disabled': this.disabled,
        }}
      >
        <span
          part="trigger"
          class="dropdown__trigger"
          onClick={() => {
            if (this.disabled) return;
            if (this.open) {
              this.hide();
            } else {
              setTimeout(() => {
                this.show();
              }, 0);
            }
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
          onClick={e => this.handleClick(e)}
          ref={el => (this.panel = el as HTMLElement)}
        >
          <slot></slot>
        </div>
      </div>
    );
  }
}
