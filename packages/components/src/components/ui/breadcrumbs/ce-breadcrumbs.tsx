import { Component, h, Fragment, Prop, Element } from '@stencil/core';

@Component({
  tag: 'ce-breadcrumbs',
  styleUrl: 'ce-breadcrumbs.css',
  shadow: true,
})
export class CeBreadcrumbs {
  @Element() el: HTMLElement;
  /**
   * The label to use for the breadcrumb control. This will not be shown, but it will be announced by screen readers and
   * other assistive devices.
   */
  @Prop() label = 'Breadcrumb';

  // Generates a clone of the separator element to use for each breadcrumb item
  private getSeparator() {
    const slotted = this.el.shadowRoot.querySelector('slot[name=separator]') as HTMLSlotElement;
    const separator = slotted.assignedElements({ flatten: true })[0] as HTMLElement;

    // Clone it, remove ids, and slot it
    const clone = separator.cloneNode(true) as HTMLElement;

    [clone, ...clone.querySelectorAll('[id]')].forEach(el => el.removeAttribute('id'));
    clone.slot = 'separator';

    return clone;
  }

  handleSlotChange() {
    const slotted = this.el.shadowRoot.querySelector('.breadcrumb slot') as HTMLSlotElement;
    const items = slotted.assignedElements().filter(node => {
      return node.nodeName === 'CE-BREADCRUMB';
    }) as HTMLCeBreadcrumbElement[];

    items.forEach((item, index) => {
      // Append separators to each item if they don't already have one
      const separator = item.querySelector('[slot="separator"]');
      if (separator === null) {
        item.append(this.getSeparator());
      }

      // The last breadcrumb item is the "current page"
      if (index === items.length - 1) {
        item.setAttribute('aria-current', 'page');
      } else {
        item.removeAttribute('aria-current');
      }
    });
  }

  render() {
    return (
      <Fragment>
        <nav part="base" class="breadcrumb" aria-label={this.label}>
          <slot onSlotchange={() => this.handleSlotChange()}></slot>
        </nav>
        <div hidden aria-hidden="true">
          <slot name="separator">
            <ce-icon name="chevron-right"></ce-icon>
          </slot>
        </div>
      </Fragment>
    );
  }
}
