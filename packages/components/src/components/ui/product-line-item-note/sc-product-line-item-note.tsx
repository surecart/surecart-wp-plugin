import { Component, h, Prop, State, Watch, Element } from '@stencil/core';
import { __ } from '@wordpress/i18n';

@Component({
  tag: 'sc-product-line-item-note',
  styleUrl: 'sc-product-line-item-note.scss',
  shadow: true,
})
export class ScProductLineItemNote {
  @Element() el: HTMLElement;
  @Prop() note: string;
  @State() expanded = false;
  @State() isOverflowing = false;

  private noteEl?: HTMLDivElement;

  @Watch('note')
  noteChanged() {
    this.checkOverflow();
  }

  componentDidLoad() {
    this.checkOverflow();
  }

  componentDidUpdate() {
    this.checkOverflow();
  }

  checkOverflow() {
    if (!this.noteEl) return;
    this.isOverflowing = this.noteEl.scrollHeight > this.noteEl.clientHeight + 1;
  }

  toggle() {
    this.expanded = !this.expanded;
  }

  render() {
    if (!this.note) return null;

    return (
      <div class="base" part="base">
        <div
          class={{
            'item__note': true,
            'item__note--expanded': this.expanded,
          }}
          ref={el => (this.noteEl = el as HTMLDivElement)}
        >
          {this.note}
        </div>

        {(this.isOverflowing || this.expanded) && (
          <button class="item__note-toggle" onClick={() => this.toggle()} type="button">
            {this.expanded ? __('less', 'surecart') : __('more', 'surecart')}
          </button>
        )}
      </div>
    );
  }
}
