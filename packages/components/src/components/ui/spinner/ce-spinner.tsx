import { Component, h } from '@stencil/core';

@Component({
  tag: 'ce-spinner',
  styleUrl: 'ce-spinner.scss',
  shadow: true,
})
export class CESpinner {
  render() {
    return <span part="base" class="spinner" aria-busy="true" aria-live="polite"></span>;
  }
}
