import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'sc-product-collection-badge',
  styleUrl: 'sc-product-collection-badge.css',
  shadow: true,
})
export class ScProductCollectionBadge {
  /** Collection name */
  @Prop() name: string;

  /** Collection tag size */
  @Prop({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium';

  /** Draws a pill-style tag with rounded edges. */
  @Prop({ reflect: true }) pill: boolean = false;

  /** Collection tag type */
  @Prop({ reflect: true }) type: 'primary' | 'success' | 'info' | 'warning' | 'danger' | 'default';

  render() {
    return (
      <sc-tag type={this.type} size={this.size} pill={this.pill}>
        {this.name}
      </sc-tag>
    );
  }
}
