import { Component, Element, h, Prop, State } from '@stencil/core';

@Component({
  tag: 'sc-stacked-list-row',
  styleUrl: 'sc-stacked-list-row.scss',
  shadow: true,
})
export class ScStackedListRow {
  @Element() el: HTMLElement;

  @Prop() href: string;
  @Prop() target: string = '_self';

  @Prop() mobileSize: number = 600;

  @State() width: number;
  @State() private hasPrefix = false;
  @State() private hasSuffix = false;

  componentDidLoad() {
    // Only run if ResizeObserver is supported.
    if ('ResizeObserver' in window) {
      var ro = new window.ResizeObserver(entries => {
        entries.forEach(entry => {
          this.width = entry.contentRect.width;
        });
      });
      ro.observe(this.el);
    }
  }

  handleSlotChange() {
    this.hasPrefix = !!Array.from(this.el.children).some(child => child.slot === 'prefix');
    this.hasSuffix = !!Array.from(this.el.children).some(child => child.slot === 'suffix');
  }

  render() {
    const Tag = this.href ? 'a' : 'div';

    return (
      <Tag
        href={this.href}
        target={this.target}
        part="base"
        class={{
          'list-row': true,
          'list-row--has-prefix': this.hasPrefix,
          'list-row--has-suffix': this.hasSuffix,
          'breakpoint-lg': this.width >= this.mobileSize,
        }}
      >
        <span class="list-row__prefix">
          <slot name="prefix" onSlotchange={() => this.handleSlotChange()}></slot>
        </span>
        <slot onSlotchange={() => this.handleSlotChange()}></slot>
        <span class="list-row__suffix">
          <slot name="suffix" onSlotchange={() => this.handleSlotChange()}></slot>
        </span>
      </Tag>
    );
  }
}
