import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'sc-product-collections',
  styleUrl: 'sc-product-collections.scss',
  shadow: true,
})
export class ScProductCollections {
  /** Collection tag size */
  @Prop({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium';

  /** Draws a pill-style tag with rounded edges. */
  @Prop({ reflect: true }) pill: boolean = false;

  /** Collection tag type */
  @Prop({ reflect: true }) type: 'primary' | 'success' | 'info' | 'warning' | 'danger' | 'default';

  render() {
    return (
      <sc-flex justifyContent="flex-start" >
        <sc-product-collection-badge size={this.size} pill={this.pill} type={this.type} name="Male"></sc-product-collection-badge>
        {/* <sc-product-collection-badge size={this.size} pill={this.pill} type={this.type} name="Female"></sc-product-collection-badge> */}
        <sc-product-collection-badge size={this.size} pill={this.pill} type={this.type} name="Unisex"></sc-product-collection-badge>
      </sc-flex>
    );
  }
}
