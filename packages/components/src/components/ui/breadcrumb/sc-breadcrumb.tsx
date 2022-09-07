import { Component, Element, h, Prop, State } from '@stencil/core';

/**
 * @part base - The elements base wrapper.
 * @part label - The label.
 * @part suffix - The suffix item.
 * @part prefix - The prefix item.
 * @part separator - The separator.
 */
@Component({
  tag: 'sc-breadcrumb',
  styleUrl: 'sc-breadcrumb.css',
  shadow: true,
})
export class ScBreadcrumb {
  @Element() el: HTMLScBreadcrumbElement;
  /**
   * Optional URL to direct the user to when the breadcrumb item is activated. When set, a link will be rendered
   * internally. When unset, a button will be rendered instead.
   */
  @Prop() href?: string;

  /** Tells the browser where to open the link. Only used when `href` is set. */
  @Prop() target?: '_blank' | '_parent' | '_self' | '_top';

  /** The `rel` attribute to use on the link. Only used when `href` is set. */
  @Prop() rel = 'noreferrer noopener';

  @State() hasPrefix: boolean;
  @State() hasSuffix: boolean;

  handleSlotChange() {
    this.hasPrefix = !!this.el.querySelector('[slot="prefix"]');
    this.hasSuffix = !!this.el.querySelector('[slot="suffix"]');
  }

  render() {
    const Tag = this.href ? 'a' : 'div';

    return (
      <div
        part="base"
        class={{
          'breadcrumb-item': true,
          'breadcrumb-item--has-prefix': this.hasPrefix,
          'breadcrumb-item--has-suffix': this.hasSuffix,
        }}
      >
        <span part="prefix" class="breadcrumb-item__prefix">
          <slot name="prefix"></slot>
        </span>
        <Tag part="label" class="breadcrumb-item__label breadcrumb-item__label--link" href={this.href} target={this.target} rel={this.rel}>
          <slot />
        </Tag>
        <span part="suffix" class="breadcrumb-item__suffix">
          <slot name="suffix" onSlotchange={() => this.handleSlotChange()}></slot>
        </span>
        <span part="separator" class="breadcrumb-item__separator" aria-hidden="true">
          <slot name="separator" onSlotchange={() => this.handleSlotChange()}>
            <sc-icon name="chevron-right"></sc-icon>
          </slot>
        </span>
      </div>
    );
  }
}
