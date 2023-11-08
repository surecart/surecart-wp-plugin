import { Component, h, Prop } from '@stencil/core';
import { __ } from '@wordpress/i18n';

@Component({
  tag: 'sc-pill-option',
  styleUrl: 'sc-pill-option.scss',
  shadow: false,
})
export class ScPillOption {
  /** Label */
  @Prop() isSelected: boolean;
  @Prop() isUnavailable: boolean;

  render() {
    return (
      <button
        class={{
          'sc-pill-option__button': true,
          'sc-pill-option__button--disabled': this.isUnavailable,
          'sc-pill-option__button--selected': this.isSelected,
        }}
        tabindex="0"
        role="radio"
        aria-checked={this.isSelected ? 'true' : 'false'}
        aria-disabled={this.isUnavailable ? 'true' : 'false'}
      >
        <slot />
      </button>
    );
  }
}
