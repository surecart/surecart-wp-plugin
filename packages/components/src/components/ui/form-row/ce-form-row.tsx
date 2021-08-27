import { Component, State, Element, h } from '@stencil/core';

@Component({
  tag: 'ce-form-row',
  styleUrl: 'ce-form-row.scss',
  shadow: true,
})
export class CEFormRow {
  private observer;

  @Element() el: HTMLCeFormRowElement;

  @State() width: number;

  componentDidLoad() {
    if ('ResizeObserver' in self) {
      this.observer = new ResizeObserver(entries => {
        this.width = entries?.[0].contentRect.width;
      });
      this.observer.observe(this.el);
    }
  }

  render() {
    return (
      <div
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
