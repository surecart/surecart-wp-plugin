import { Component, h } from '@stencil/core';

@Component({
  tag: 'sc-spinner',
  styleUrl: 'sc-spinner.scss',
  shadow: true,
})
export class ScSpinner {
  render() {
    return <span part="base" class="spinner" aria-busy="true" aria-live="polite"></span>;
  }
}
