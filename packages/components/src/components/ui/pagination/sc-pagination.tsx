import { Component, h, Prop, Watch, State, Event, EventEmitter } from '@stencil/core';
import { sprintf, __ } from '@wordpress/i18n';

@Component({
  tag: 'sc-pagination',
  styleUrl: 'sc-pagination.css',
  shadow: true,
})
export class ScPagination {
  @Prop() page: number = 1;
  @Prop() perPage: number = 0;
  @Prop() total: number = 0;
  @Prop() totalShowing: number = 0;
  @Prop() totalPages: number = 0;

  @State() hasNextPage: boolean;
  @State() hasPreviousPage: boolean;
  @State() from: number;
  @State() to: number;

  @Event() scPrevPage: EventEmitter<void>;
  @Event() scNextPage: EventEmitter<void>;

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
      <sc-flex>
        <div>{sprintf(__('Displaying %1d to %2d of %3d items', 'surecart'), this.from, this.to, this.total)}</div>
        <sc-flex>
          <sc-button onClick={() => this.scPrevPage.emit()} disabled={!this.hasPreviousPage} size="small">
            {__('Previous', 'surecart')}
          </sc-button>
          <sc-button onClick={() => this.scNextPage.emit()} disabled={!this.hasNextPage} size="small">
            {__('Next', 'surecart')}
          </sc-button>
        </sc-flex>
      </sc-flex>
    );
  }
}
