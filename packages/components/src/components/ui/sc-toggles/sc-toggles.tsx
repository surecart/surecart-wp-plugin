import { Component, Element, h, Listen, Prop, Watch } from '@stencil/core';

@Component({
  tag: 'sc-toggles',
  styleUrl: 'sc-toggles.css',
  shadow: true,
})
export class ScToggles {
  /** The element */
  @Element() el: HTMLScTogglesElement;

  /** Should this function as an accordion? */
  @Prop() accordion: boolean = false;

  /** Are these collapsible? */
  @Prop() collapsible: boolean = true;

  getToggles() {
    let slotted = this.el.shadowRoot.querySelector('slot') as HTMLSlotElement;
    if (!slotted) return;
    return (slotted?.assignedNodes?.()?.filter?.(node => node.nodeName === 'SC-TOGGLE') as HTMLScToggleElement[]) || [];
  }

  @Listen('scShow')
  handleShowChange(event) {
    this.getToggles().map(details => (details.open = event.target === details));
  }

  @Watch('collapsible')
  handleCollapibleChange() {
    this.getToggles().map(details => (details.collapsible = this.collapsible));
  }

  componentDidLoad() {
    this.handleCollapibleChange();
    const toggles = this.getToggles();
    if (toggles?.length && !toggles.some(toggle => toggle.open)) {
      toggles[0].open = true;
    }
  }

  render() {
    return (
      <div class="toggles" part="base">
        <slot></slot>
      </div>
    );
  }
}
