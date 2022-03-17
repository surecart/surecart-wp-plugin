import { Component, Element, h, Prop, State } from '@stencil/core';

@Component({
  tag: 'ce-stacked-list-row',
  styleUrl: 'ce-stacked-list-row.scss',
  shadow: true,
})
export class CeStackedListRow {
  @Element() el: HTMLElement;

  @Prop() href: string;

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
    this.hasPrefix = !!this.el.querySelector('[slot="prefix"]');
    this.hasSuffix = !!this.el.querySelector('[slot="suffix"]');
  }

  render() {
    const Tag = this.href ? 'a' : 'div';

    return (
      <Tag
        href={this.href}
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
