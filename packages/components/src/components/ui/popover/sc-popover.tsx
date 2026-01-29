import { Component, Element, Prop, Event, EventEmitter, Watch, State, h } from '@stencil/core';
import { autoUpdate, computePosition, flip, offset, shift, size } from '@floating-ui/dom';
import { __ } from '@wordpress/i18n';
import { speak } from '@wordpress/a11y';

/**
 * @part base - The elements base wrapper.
 * @part trigger - The trigger.
 * @part panel - The panel.
 */
@Component({
  tag: 'sc-popover',
  styleUrl: 'sc-popover.scss',
  shadow: true,
})
export class ScPopover {
  @Element() el: HTMLDivElement;
  private panel?: HTMLElement;
  private trigger?: HTMLElement;
  private positioner?: HTMLDivElement;

  private positionerCleanup: ReturnType<typeof autoUpdate> | undefined;
  private boundHandleOutsideClick = (evt: MouseEvent) => this.handleOutsideClick(evt);
  private boundHandleKeyDown = (evt: KeyboardEvent) => this.handleKeyDown(evt);
  private boundHandleFocusOut = (evt: FocusEvent) => this.handleFocusOut(evt);

  /** Is this disabled. */
  @Prop() disabled: boolean;

  /** Indicates whether or not the popover is open. You can use this in lieu of the show/hide methods. */
  @Prop({ reflect: true, mutable: true }) open?: boolean = false;

  /** The placement of the popover. */
  @Prop({ reflect: true }) placement:
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'right'
    | 'right-start'
    | 'right-end'
    | 'left'
    | 'left-start'
    | 'left-end' = 'bottom-start';

  /** The distance in pixels from which to offset the panel away from its trigger. */
  @Prop() distance: number = 0;

  /** The distance in pixels from which to offset the panel along its trigger. */
  @Prop() skidding: number = 0;

  /**
   * Enable this option to prevent the panel from being clipped when the component is placed inside a container with
   * `overflow: auto|scroll`.
   */
  @Prop() hoist: boolean = false;

  /** Emitted when the popover opens. Calling `event.preventDefault()` will prevent it from being opened. */
  @Event() scShow: EventEmitter<void>;

  /** Emitted when the popover closes. Calling `event.preventDefault()` will prevent it from being closed. */
  @Event() scHide: EventEmitter<void>;

  /* Internal visible state */
  @State() isVisible: boolean;

  @Watch('open')
  handleOpenChange() {
    this.open ? this.show() : this.hide();
  }

  handleOutsideClick(evt: MouseEvent) {
    const path = evt.composedPath();
    if (
      !path.some(item => {
        return item === this.el;
      })
    ) {
      this.open = false;
    }
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      event.stopPropagation();
      this.hide();
    }
  }

  handleTriggerKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (this.disabled) return;
      if (this.open) {
        this.hide();
      } else {
        this.show();
      }
    }
  }

  /**
   * Handles focus leaving the popover.
   * Closes the popover if focus moves outside of it.
   */
  handleFocusOut(event: FocusEvent) {
    const relatedTarget = event.relatedTarget as Node;
    // If focus is moving to something outside the popover, close it
    if (relatedTarget && !this.el.contains(relatedTarget)) {
      this.open = false;
    }
  }

  startPositioner() {
    this.stopPositioner();
    this.updatePositioner();
    this.positionerCleanup = autoUpdate(this.trigger, this.positioner, this.updatePositioner.bind(this));
  }

  updatePositioner() {
    if (!this.open || !this.trigger || !this.positioner) {
      return;
    }

    computePosition(this.trigger, this.positioner, {
      placement: this.placement,
      middleware: [
        offset({ mainAxis: this.distance, crossAxis: this.skidding }),
        flip(),
        shift(),
        size({
          apply: ({ availableWidth: width, availableHeight: height }) => {
            // Ensure the panel stays within the viewport when we have lots of menu items
            Object.assign(this.panel.style, {
              maxWidth: `${width}px`,
              maxHeight: `${height}px`,
            });
          },
          padding: 8,
        }),
      ],
      strategy: this.hoist ? 'fixed' : 'absolute',
    }).then(({ x, y, placement }) => {
      this.positioner.setAttribute('data-placement', placement);

      Object.assign(this.positioner.style, {
        position: this.hoist ? 'fixed' : 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        right: 'auto',
      });
    });
  }

  stopPositioner() {
    if (this.positionerCleanup) {
      this.positionerCleanup();
      this.positionerCleanup = undefined;
      this.positioner?.removeAttribute('data-placement');
    }
  }

  show() {
    speak(__('Popover opened. Press Escape to close.', 'surecart'), 'assertive');
    this.scShow.emit();
    // Prevent subsequent calls to the method, whether manually or triggered by the `open` watcher
    if (this.isVisible) {
      return;
    }
    this.isVisible = true;
    this.open = true;
    this.startPositioner();
    document.addEventListener('keydown', this.boundHandleKeyDown);
    this.el.addEventListener('focusout', this.boundHandleFocusOut);
    this.panel.focus();
  }

  hide() {
    speak(__('Popover closed.', 'surecart'), 'assertive');
    this.scHide.emit();
    // Prevent subsequent calls to the method, whether manually or triggered by the `open` watcher
    if (!this.isVisible) {
      return;
    }
    this.stopPositioner();
    document.removeEventListener('keydown', this.boundHandleKeyDown);
    this.el.removeEventListener('focusout', this.boundHandleFocusOut);
    this.isVisible = false;
    this.open = false;
    const slotted = this.el.shadowRoot.querySelector('slot[name="trigger"]') as HTMLSlotElement;
    const trigger = slotted.assignedElements({ flatten: true })[0] as HTMLElement;
    trigger?.focus?.();
  }

  componentWillLoad() {
    document.addEventListener('mousedown', this.boundHandleOutsideClick);
  }

  disconnectedCallback() {
    document.removeEventListener('mousedown', this.boundHandleOutsideClick);
    document.removeEventListener('keydown', this.boundHandleKeyDown);
    this.el.removeEventListener('focusout', this.boundHandleFocusOut);
  }

  handleHide() {
    this.open = false;
    this.trigger.focus();
  }

  render() {
    return (
      <div
        part="base"
        class={{
          'popover': true,
          'popover--open': this.open,
          'popover--disabled': this.disabled,
        }}
      >
        <span
          part="trigger"
          class="popover__trigger"
          ref={el => (this.trigger = el as HTMLElement)}
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
          onKeyDown={e => this.handleTriggerKeyDown(e)}
          tabindex="0"
          role="button"
          aria-expanded={this.open ? 'true' : 'false'}
          aria-haspopup="dialog"
          aria-label={__('Press Enter to open popover', 'surecart')}
        >
          <slot name="trigger"></slot>
        </span>

        {/* Position the panel with a wrapper since the popover makes use of translate. This let's us add animations
        on the panel without interfering with the position. */}
        <div class="popover__positioner" ref={el => (this.positioner = el as HTMLDivElement)}>
          <div
            part="panel"
            class="popover__panel"
            role="dialog"
            aria-modal="false"
            tabindex="-1"
            ref={el => (this.panel = el as HTMLElement)}
          >
            <div class="popover__header">
              <slot name="title" />
              <button
                type="button"
                class="popover__header-close-button"
                onClick={() => this.handleHide()}
                onKeyDown={e => e.key === 'Enter' && this.handleHide()}
                aria-label={__('Close', 'surecart')}
              >
                <sc-icon class="popover__header-close-icon" name="x" />
              </button>
            </div>
            <slot name="content"></slot>
            <div class="popover__footer">
              <slot name="footer"></slot>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
