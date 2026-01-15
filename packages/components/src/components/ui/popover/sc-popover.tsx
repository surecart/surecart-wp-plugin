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

  /** Is this disabled. */
  @Prop() disabled: boolean;

  /** Indicates whether or not the popover is open. You can use this in lieu of the show/hide methods. */
  @Prop({ reflect: true, mutable: true }) open?: boolean = false;

  /** The placement of the popover panel */
  @Prop() position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

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

  constructor() {
    // Bind the submit function to the component instance
    this.handleDocumentMouseDown = this.handleDocumentMouseDown.bind(this);
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
      this.positioner.removeAttribute('data-placement');
    }
  }

  show() {
    speak(__('Popover opened.', 'surecart'), 'assertive');
    this.scShow.emit();
    // Prevent subsequent calls to the method, whether manually or triggered by the `open` watcher
    if (this.isVisible) {
      return;
    }
    this.isVisible = true;
    this.open = true;
    this.startPositioner();

    requestAnimationFrame(() => {
      this.panel?.focus();
    });
  }

  hide() {
    speak(__('Popover closed.', 'surecart'), 'assertive');
    this.scHide.emit();
    // Prevent subsequent calls to the method, whether manually or triggered by the `open` watcher
    if (!this.isVisible) {
      return;
    }
    this.stopPositioner();
    this.isVisible = false;
    this.open = false;
    const slotted = this.el.shadowRoot.querySelector('slot[name="trigger"]') as HTMLSlotElement;
    const trigger = slotted.assignedElements({ flatten: true })[0] as HTMLElement;
    trigger.focus();
  }

  handleDocumentMouseDown(evt: MouseEvent) {
    const path = evt.composedPath();
    if (
      !path.some(item => {
        return item === this.el;
      })
    ) {
      this.hide();
    }
  }

  componentWillLoad() {
    document.addEventListener('mousedown', this.handleDocumentMouseDown);
  }

  disconnectedCallback() {
    document.removeEventListener('mousedown', this.handleDocumentMouseDown);
    this.stopPositioner(); // 👈 important cleanup
  }

  handleHide() {
    this.open = false;
    this.trigger.focus();
  }

  handleClick() {
    if (this.disabled) return;
    if (this.open) {
      this.hide();
    } else {
      setTimeout(() => {
        this.show();
      }, 0);
    }
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
          onClick={() => this.handleClick()}
          aria-expanded={this.open ? 'true' : 'false'}
          aria-haspopup="true"
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === 'Escape') {
              this.handleClick();
            }
          }}
        >
          <slot name="trigger"></slot>
        </span>

        {/* Position the panel with a wrapper since the popover makes use of translate. This let's us add animations
        on the panel without interfering with the position. */}
        <div class="popover__positioner" ref={el => (this.positioner = el as HTMLDivElement)}>
          <div
            part="panel"
            class={{
              'popover__panel': true,
              'popover__panel--top-left': this.position === 'top-left',
              'popover__panel--top-right': this.position === 'top-right',
              'popover__panel--bottom-left': this.position === 'bottom-left',
              'popover__panel--bottom-right': this.position === 'bottom-right',
            }}
            aria-orientation="vertical"
            tabindex="-1"
            ref={el => (this.panel = el as HTMLElement)}
            onKeyDown={(e: KeyboardEvent) => {
              if (e.key === 'Escape') {
                e.stopPropagation();
                this.hide();
              }
            }}
            role="dialog"
            aria-label={__('Information on switching checkout from Test Mode to Live Mode', 'surecart')}
          >
            <div class="popover__header">
              <slot name="title" />
              <sc-button size="small" type="text" class="popover__header-close-icon" aria-label={__('Close popover', 'surecart')} onClick={() => this.handleHide()}>
                <sc-icon aria-hidden="true" class="popover__header-close-icon" name="x" />
              </sc-button>
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
