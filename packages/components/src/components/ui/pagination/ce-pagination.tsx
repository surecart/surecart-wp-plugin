import { Component, h, Prop, Watch, State, Event, EventEmitter } from '@stencil/core';
import { sprintf, __ } from '@wordpress/i18n';

@Component({
  tag: 'ce-pagination',
  styleUrl: 'ce-pagination.css',
  shadow: true,
})
export class CePagination {
  @Prop() page: number = 1;
  @Prop() perPage: number = 0;
  @Prop() total: number = 0;
  @Prop() totalShowing: number = 0;
  @Prop() totalPages: number = 0;

  @State() hasNextPage: boolean;
  @State() hasPreviousPage: boolean;
  @State() from: number;
  @State() to: number;

  @Event() cePrevPage: EventEmitter<void>;
  @Event() ceNextPage: EventEmitter<void>;

  componentWillLoad() {
    this.handlePaginationChange();
  }

  @Watch('total')
  @Watch('totalPages')
  @Watch('page')
  @Watch('perPage')
  @Watch('totalShowing')
  handlePaginationChange() {
    // do we have a previous or next page?
    this.hasNextPage = this.total > 1 && this.page < this.totalPages;
    this.hasPreviousPage = this.totalPages > 1 && this.page > 1;

    // from->to.
    this.from = this.perPage * (this.page - 1) + 1;
    this.to = Math.min(this.from + this.totalShowing - 1, this.total);
  }

  render() {
    if (!this.hasNextPage && !this.hasPreviousPage) return null;
    return (
      <ce-flex>
        <div>{sprintf(__('Displaying %1d to %2d of %3d items', 'surecart'), this.from, this.to, this.total)}</div>
        <ce-flex>
          <ce-button onClick={() => this.cePrevPage.emit()} disabled={!this.hasPreviousPage} size="small">
            {__('Previous', 'surecart')}
          </ce-button>
          <ce-button onClick={() => this.ceNextPage.emit()} disabled={!this.hasNextPage} size="small">
            {__('Next', 'surecart')}
          </ce-button>
        </ce-flex>
      </ce-flex>
    );
  }
}
