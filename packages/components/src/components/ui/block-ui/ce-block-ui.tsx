import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'ce-block-ui',
  styleUrl: 'ce-block-ui.scss',
  shadow: true,
})
export class CeBlockUi {
  render() {
    return (
      <div class="overlay">
        <ce-spinner></ce-spinner>
      </div>
    );
  }
}
