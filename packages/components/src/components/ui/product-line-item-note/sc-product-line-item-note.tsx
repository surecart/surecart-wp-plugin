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

  private noteEl?: HTMLScTextElement;

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

    setTimeout(() => {
      if (this.noteEl) {
        this.isOverflowing = this.noteEl.scrollHeight > this.noteEl.clientHeight;
      }
    }, 50);
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
            'line-item-note': true,
            'line-item-note--is-expanded': this.expanded,
          }}
        >
          <sc-text ref={el => (this.noteEl = el as HTMLScTextElement)} class="line-item-note__text">
            {this.note}
          </sc-text>

          {(this.isOverflowing || this.expanded) && (
            <button
              class="line-item-note__toggle"
              type="button"
              onClick={() => this.toggle()}
              title={this.expanded ? __('Collapse note', 'surecart') : __('Expand note', 'surecart')}
            >
              <sc-icon name={this.expanded ? 'chevron-up' : 'chevron-down'} style={{ width: '16px', height: '16px' }}></sc-icon>
            </button>
          )}
        </div>
      </div>
    );
  }
}
