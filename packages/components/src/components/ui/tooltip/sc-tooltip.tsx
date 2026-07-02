import { Component, h, Prop, State, Element, Listen } from '@stencil/core';

/**
 * @part base - The elements base wrapper.
 * @part text - The tooltip text.
 */
@Component({
  tag: 'sc-tooltip',
  styleUrl: 'sc-tooltip.scss',
  shadow: true,
})
export class ScTooltip {
  @Element() el: HTMLScTooltipElement;
  private tooltip: HTMLDivElement;

  /** Open or not */
  @Prop({ mutable: true }) open: boolean;

  /** Tooltip fixed width */
  @Prop() width: string;

  /** Tooltip text */
  @Prop() text: string;

  /** Freeze open or closed. */
  @Prop() freeze: boolean;

  /** The tooltip's padding. */
  @Prop() padding: number = 5;

  /**
   * The tooltip's type.
   *
   * - `info` (default) — current SureCart blue/info style with a colored arrow.
   * - `primary`/`success`/`warning`/`danger` — accent-colored variants.
   * - `text` — legacy passthrough used by long-form tooltips.
   * - `dark` — flat black background with white text, matching the
   *   WordPress admin button tooltip ("View options"-style). No colored
   *   accent, no arrow, no padding flourish — just the WP look.
   */
  @Prop({ reflect: true }) type: 'primary' | 'success' | 'info' | 'warning' | 'danger' | 'text' | 'dark' = 'info';

  /** The tooltip's placement relative to the trigger. */
  @Prop({ reflect: true }) placement: 'top' | 'bottom' | 'left' | 'right' = 'top';

  @State() top: number = -10000;
  @State() left: number = -10000;

  // Reposition after render, once the bubble ref exists — a post-watch
  // setTimeout raced the first render and could leave the bubble parked.
  componentDidRender() {
    this.handleWindowScroll();
  }

  @Listen('scroll', { target: 'window' })
  @Listen('resize', { target: 'window' })
  handleWindowScroll() {
    if (!this.open) return;
    if (!this.tooltip) return;

    const tooltipRect = this.tooltip.getBoundingClientRect();
    const triggerRect = this.el.getBoundingClientRect();

    let top: number;
    let left: number;

    if (this.placement === 'bottom') {
      top = triggerRect.bottom + this.padding;
      left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
    } else if (this.placement === 'left') {
      top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
      left = triggerRect.left - tooltipRect.width - this.padding;
    } else if (this.placement === 'right') {
      top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
      left = triggerRect.right + this.padding;
    } else {
      // 'top' — original behavior, preserved as the default.
      top = triggerRect.top - (tooltipRect.height + this.padding);
      left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2 + this.padding;
    }

    // clientWidth, not innerWidth: the bubble must not sit under the scrollbar.
    // Overflowing top/bottom bubbles align to the trigger's edge — pinning
    // them to the viewport edge reads as clipped.
    const edgeMargin = 8;
    const maxLeft = document.documentElement.clientWidth - tooltipRect.width - edgeMargin;
    if (this.placement === 'top' || this.placement === 'bottom') {
      if (left > maxLeft) {
        left = triggerRect.right - tooltipRect.width;
      } else if (left < edgeMargin) {
        left = triggerRect.left;
      }
    }
    this.top = top;
    this.left = Math.min(Math.max(left, edgeMargin), Math.max(maxLeft, edgeMargin));
  }

  handleBlur() {
    if (this.freeze) return;
    this.open = false;
  }
  handleClick() {
    if (this.freeze) return;
    this.open = true;
  }
  handleFocus() {
    if (this.freeze) return;
    this.open = true;
  }
  handleMouseOver() {
    if (this.freeze) return;
    this.open = true;
  }
  handleMouseOut() {
    if (this.freeze) return;
    this.open = false;
  }

  render() {
    if (!this.text) {
      return <slot />;
    }

    return (
      <span
        part="base"
        class={{
          'tooltip': true,
          // Types
          'tooltip--primary': this.type === 'primary',
          'tooltip--success': this.type === 'success',
          'tooltip--info': this.type === 'info',
          'tooltip--warning': this.type === 'warning',
          'tooltip--danger': this.type === 'danger',
          'tooltip--dark': this.type === 'dark',
          'tooltip--top': this.placement === 'top',
          'tooltip--bottom': this.placement === 'bottom',
          'tooltip--left': this.placement === 'left',
          'tooltip--right': this.placement === 'right',
          'tooltip--has-width': !!this.width,
        }}
        onClick={() => this.handleClick()}
        onBlur={() => this.handleBlur()}
        onFocus={() => this.handleFocus()}
        onMouseOver={() => this.handleMouseOver()}
        onMouseOut={() => this.handleMouseOut()}
      >
        <slot></slot>
        {!!this.open && (
          <div
            part="text"
            ref={el => (this.tooltip = el as HTMLDivElement)}
            class="tooltip-text"
            style={{
              top: `${this.top}px`,
              left: `${this.left}px`,
              ...(this.width ? { '--sc-tooltip-width': this.width } : {}),
            }}
          >
            {this.text}
          </div>
        )}
      </span>
    );
  }
}
