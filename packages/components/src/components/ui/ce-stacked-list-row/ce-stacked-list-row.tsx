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

  componentDidLoad() {
    // Only run if ResizeObserver is supported.
    if ('ResizeObserver' in window) {
      var ro = new ResizeObserver(entries => {
        entries.forEach(entry => {
          this.width = entry.contentRect.width;
          console.log(this.width);
        });
      });
      ro.observe(this.el);
    }
  }

  render() {
    const Tag = this.href ? 'a' : 'div';

    return (
      <Tag
        href={this.href}
        class={{
          'list-row': true,
          'breakpoint-lg': this.width >= this.mobileSize,
        }}
      >
        <slot></slot>
      </Tag>
    );
  }
}
