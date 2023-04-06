import { Component, Prop, h } from '@stencil/core';
import { addQueryArgs } from '@wordpress/url';

@Component({
  tag: 'sc-products-pagination',
  styleUrl: 'sc-products-pagination.scss',
  shadow: true,
})
export class ScProductsPagination {
  /* Item styles */
  @Prop() totalPages: number;

  /* Item styles */
  @Prop() currentPage: number;

  getHref(page: number) {
    return addQueryArgs(location.href, { 'product-page': page });
  }

  /* Render all the page button */
  renderPageButtons(total: number, current: number) {
    let arr: number[] = [];
    for (let i = 0; i < total; i++) {
      arr.push(i + 1);
    }

    return arr.map(num => {
      const href = this.getHref(num);
      return (
        <sc-button type={current === num ? 'primary' : 'default'} size="small" href={href}>
          <span>{num}</span>
        </sc-button>
      );
    });
  }

  render() {
    return (
      <div class={{ pagination: true }}>
        <sc-button type="default" size="small" disabled={this.currentPage === 1} href={this.getHref(this.currentPage - 1)}>
          <sc-icon name="arrow-left"></sc-icon>
        </sc-button>
        {this.renderPageButtons(this.totalPages, this.currentPage)}
        <sc-button type="default" size="small" disabled={this.currentPage === this.totalPages} href={this.getHref(this.currentPage + 1)}>
          <sc-icon name="arrow-right"></sc-icon>
        </sc-button>
      </div>
    );
  }
}
