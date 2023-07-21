import { Component, Prop, State, h } from '@stencil/core';
import { ProductCollection } from 'src/types';
import apiFetch from '../../../../functions/fetch';
import { addQueryArgs } from '@wordpress/url';
import { state } from '@store/product';

@Component({
  tag: 'sc-product-collections',
  styleUrl: 'sc-product-collections.scss',
  shadow: true,
})
export class ScProductCollections {
  /** Number of collection tags to show*/
  @Prop({ reflect: true }) collectionCount: number;

  @State() productCollections: ProductCollection[] = [];
  @State() busy: boolean = false;

  async fetchProductCollections() {
    try {
      this.productCollections = (await apiFetch({
        path: addQueryArgs('surecart/v1/product_collections', {
          per_page: this.collectionCount,
          product_ids: [state.product?.id],
        }),
      })) as ProductCollection[];
    } catch (err) {
    } finally {
      this.busy = false;
    }
  }

  componentDidLoad() {
    this.fetchProductCollections();
  }

  render() {
    return (
      <sc-flex justifyContent="flex-start" part="content">
        {this.productCollections?.map(collection => (
          <sc-product-collection-badge key={collection.id}>{collection.name}</sc-product-collection-badge>
        ))}
      </sc-flex>
    );
  }
}
