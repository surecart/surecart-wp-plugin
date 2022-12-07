import { Component, State, Element, h } from '@stencil/core';

@Component({
  tag: 'sc-form-row',
  styleUrl: 'sc-form-row.scss',
  shadow: true,
})
export class ScFormRow {
  private observer;

  @Element() el: HTMLScFormRowElement;

  @State() width: number;

  componentDidLoad() {
    if ('ResizeObserver' in window) {
      this.observer = new window.ResizeObserver(entries => {
        this.width = entries?.[0].contentRect.width;
      });
      this.observer.observe(this.el);
    }
  }

  render() {
    return (
      <div
        part="base"
        class={{
          'form-row': true,
          'breakpoint-sm': this.width < 384,
          'breakpoint-md': this.width >= 384 && this.width < 576,
          'breakpoint-lg': this.width >= 576 && this.width < 768,
          'breakpoint-xl': this.width >= 768,
        }}
      >
        <slot></slot>
      </div>
    );
  }
}
