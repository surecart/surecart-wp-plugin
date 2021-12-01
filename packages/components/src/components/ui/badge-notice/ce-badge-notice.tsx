import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'ce-badge-notice',
  styleUrl: 'ce-badge-notice.scss',
  shadow: true,
})
export class CeBadgeNotice {
  @Prop() type: 'primary' | 'success' | 'info' | 'warning' | 'danger' | 'text' = 'primary';
  @Prop() label: string;
  @Prop() size: 'small' | 'medium' | 'large' = 'small';

  render() {
    return (
      <div
        class={{
          'notice': true,
          'notice--is-small': this.size === 'small',
          'notice--is-medium': this.size === 'medium',
          'notice--is-large': this.size === 'large',
          'notice--primary': this.type === 'primary',
          'notice--success': this.type === 'success',
          'notice--warning': this.type === 'warning',
          'notice--danger': this.type === 'danger',
          'notice--text': this.type === 'text',
        }}
      >
        <ce-tag size={this.size} type={this.type}>
          {this.label}
        </ce-tag>
        <slot></slot>
      </div>
    );
  }
}
