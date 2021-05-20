import { Component, h } from '@stencil/core';

@Component({
  tag: 'presto-spinner',
  styleUrl: 'presto-spinner.scss',
  shadow: true,
})
export class PrestoSpinner {
  render() {
    return <span part="base" class="spinner" aria-busy="true" aria-live="polite"></span>;
  }
}
