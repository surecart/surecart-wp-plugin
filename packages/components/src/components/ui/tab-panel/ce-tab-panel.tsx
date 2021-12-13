import { Component, Prop, h, Element, Host } from '@stencil/core';
let id = 0;
@Component({
  tag: 'ce-tab-panel',
  styleUrl: 'ce-tab-panel.scss',
  shadow: true,
})
export class CeTabPanel {
  @Element() el: HTMLElement;

  private componentId = `tab-panel-${++id}`;

  /** The tab panel's name. */
  @Prop({ reflect: true }) name: string = '';

  /** When true, the tab panel will be shown. */
  @Prop({ reflect: true }) active: boolean = false;

  render() {
    // If the user didn't provide an ID, we'll set one so we can link tabs and tab panels with aria labels
    this.el.id = this.el.id || this.componentId;

    return (
      <Host style={{ display: this.active ? 'block' : 'none' }}>
        <div part="base" class="tab-panel" role="tabpanel" aria-hidden={this.active ? 'false' : 'true'}>
          <slot />
        </div>
      </Host>
    );
  }
}
