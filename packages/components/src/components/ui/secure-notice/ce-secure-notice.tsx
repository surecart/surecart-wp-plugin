import { Component, h } from '@stencil/core';

@Component({
  tag: 'ce-secure-notice',
  styleUrl: 'ce-secure-notice.scss',
  shadow: true,
})
export class CESecureNotice {
  render() {
    return (
      <div class="notice" part="base">
        <svg class="notice__icon" part="icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 512 512" fill="currentColor">
          <title>ionicons-v5-g</title>
          <path d="M368,192H352V112a96,96,0,1,0-192,0v80H144a64.07,64.07,0,0,0-64,64V432a64.07,64.07,0,0,0,64,64H368a64.07,64.07,0,0,0,64-64V256A64.07,64.07,0,0,0,368,192Zm-48,0H192V112a64,64,0,1,1,128,0Z"></path>
        </svg>
        <span class="notice__text" part="text">
          <slot>This is a secure, encrypted payment.</slot>
        </span>
      </div>
    );
  }
}
