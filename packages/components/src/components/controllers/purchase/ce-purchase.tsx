import { getSession } from '../../../services/session';
import { Order } from '../../../types';
import { Component, State, h } from '@stencil/core';
import { getQueryArg } from '@wordpress/url';
import { Universe } from 'stencil-wormhole';

@Component({
  tag: 'ce-purchase',
  styleUrl: 'ce-purchase.css',
  shadow: true,
})
export class CePurchase {
  @State() order: Order;
  @State() loading: boolean;
  @State() error: string;

  componentWillLoad() {
    // @ts-ignore
    Universe.create(this, this.state());

    this.getSession();
  }

  state() {
    return {
      error: this.error,
      order: this.order,
      loading: this.loading,
    };
  }

  async getSession() {
    const id = getQueryArg(window.location.href, 'order');
    if (!id) return;
    try {
      this.loading = true;
      this.error = '';
      this.order = await getSession(id);
    } catch (e) {
      this.error = e?.message || 'Something went wrong';
    } finally {
      this.loading = false;
    }
  }

  render() {
    if (this.loading) {
      return <ce-block-ui></ce-block-ui>;
    }
    if (this.error) {
      return <div>{this.error}</div>;
    }

    if (this.order) {
      return (
        <Universe.Provider state={this.state()}>
          <slot />
        </Universe.Provider>
      );
    }

    return '';
  }
}
