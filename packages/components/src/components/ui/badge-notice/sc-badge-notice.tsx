import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'sc-badge-notice',
  styleUrl: 'sc-badge-notice.scss',
  shadow: true,
})
export class ScBadgeNotice {
  @Prop() type: 'primary' | 'success' | 'info' | 'warning' | 'danger' | 'default' = 'primary';
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
          'notice--default': this.type === 'default',
        }}
      >
        <sc-tag size={this.size} type={this.type}>
          {this.label}
        </sc-tag>
        <slot></slot>
      </div>
    );
  }
}
