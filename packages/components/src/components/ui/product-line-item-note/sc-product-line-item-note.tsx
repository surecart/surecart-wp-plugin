import { Component, h, Prop, State, Element } from '@stencil/core';
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
  private resizeObserver?: ResizeObserver;
  private mutationObserver?: MutationObserver;

  componentDidLoad() {
    this.setupObservers();
    this.checkOverflow();
  }

  disconnectedCallback() {
    this.cleanupObservers();
  }

  setupObservers() {
    if (!this.noteEl) return;

    // ResizeObserver for container size changes
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        this.checkOverflow();
      });
      this.resizeObserver.observe(this.noteEl);
    }

    // MutationObserver for content changes
    if (typeof MutationObserver !== 'undefined') {
      this.mutationObserver = new MutationObserver(() => {
        this.checkOverflow();
      });
      this.mutationObserver.observe(this.noteEl, {
        characterData: true,
        subtree: true,
        childList: true,
      });
    }
  }

  cleanupObservers() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = undefined;
    }
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
      this.mutationObserver = undefined;
    }
  }

  checkOverflow() {
    if (!this.noteEl) return;
    this.isOverflowing = this.noteEl.scrollHeight > this.noteEl.clientHeight;
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
            'line-item-note--clickable': this.isOverflowing || this.expanded,
          }}
          tabIndex={this.isOverflowing || this.expanded ? 0 : undefined}
          onClick={() => (this.isOverflowing || this.expanded) && this.toggle()}
        >
          <div ref={el => (this.noteEl = el as HTMLDivElement)} class="line-item-note__text">
            {this.note}
          </div>

          {(this.isOverflowing || this.expanded) && (
            <button
              class="line-item-note__toggle"
              type="button"
              onClick={e => {
                e.stopPropagation();
                this.toggle();
              }}
              title={this.expanded ? __('Collapse note', 'surecart') : __('Expand note', 'surecart')}
            >
              <slot name="icon">
                <sc-icon name={this.expanded ? 'chevron-up' : 'chevron-down'} style={{ width: '16px', height: '16px' }}></sc-icon>
              </slot>
            </button>
          )}
        </div>
      </div>
    );
  }
}
