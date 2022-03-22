import { Component, h, Prop, State, Element, Listen, Watch } from '@stencil/core';

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

  /** The tooltip's type. */
  @Prop({ reflect: true }) type: 'primary' | 'success' | 'info' | 'warning' | 'danger' | 'text' = 'info';

  @State() top: number = -10000;
  @State() left: number = -10000;

  componentDidLoad() {
    this.handleWindowScroll();
  }

  @Listen('scroll', { target: 'window' })
  @Listen('resize', { target: 'window' })
  handleWindowScroll() {
    if (!this.open) return;
    if (!this.tooltip) return;

    var linkProps = this.tooltip.getBoundingClientRect();
    var tooltipProps = this.el.getBoundingClientRect();

    this.top = tooltipProps.top - (linkProps.height + this.padding);
    const min = Math.max(tooltipProps.left + tooltipProps.width / 2 - linkProps.width / 2 + this.padding, 0);
    this.left = Math.min(min, window.innerWidth - linkProps.width);
  }

  @Watch('open')
  handleOpenChange() {
    setTimeout(() => this.handleWindowScroll(), 0);
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
