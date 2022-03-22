import { Component, Element, h, Prop } from '@stencil/core';

@Component({
  tag: 'sc-button-group',
  styleUrl: 'sc-button-group.scss',
  shadow: true,
})
export class ScButtonGroup {
  @Element() el: HTMLScButtonGroupElement;

  @Prop() label: string;
  @Prop() separate: boolean;

  findButton(el: HTMLElement) {
    return ['sc-button'].includes(el.tagName.toLowerCase()) ? el : el.querySelector(['sc-button'].join(','));
  }

  handleFocus(event: Event) {
    const button = this.findButton(event.target as HTMLElement);
    button?.classList.add('sc-button-group__button--focus');
  }

  handleBlur(event: Event) {
    const button = this.findButton(event.target as HTMLElement);
    button?.classList.remove('sc-button-group__button--focus');
  }

  handleMouseOver(event: Event) {
    const button = this.findButton(event.target as HTMLElement);
    button?.classList.add('sc-button-group__button--hover');
  }

  handleMouseOut(event: Event) {
    const button = this.findButton(event.target as HTMLElement);
    button?.classList.remove('sc-button-group__button--hover');
  }

  handleSlotChange() {
    if (this.separate) return;
    const slottedElements = (this.el.shadowRoot.querySelector('slot') as HTMLSlotElement).assignedElements({ flatten: true });

    slottedElements.forEach((el: HTMLElement) => {
      const slotted = this.el.shadowRoot.querySelector('slot') as HTMLSlotElement;
      const index = slotted.assignedNodes().indexOf(el);
      const button = this.findButton(el);

      if (button !== null || !this.separate) {
        button.classList.add('sc-button-group__button');
        button.classList.toggle('sc-button-group__button--first', index === 0);
        button.classList.toggle('sc-button-group__button--inner', index > 0 && index < slottedElements.length - 1);
        button.classList.toggle('sc-button-group__button--last', index === slottedElements.length - 1);
      }
    });
  }

  render() {
    return (
      <div
        part="base"
        class={{
          'button-group': true,
          'button-group--separate': this.separate,
        }}
        role="group"
        aria-label={this.label}
        onFocusout={e => this.handleBlur(e)}
        onFocusin={e => this.handleFocus(e)}
        onMouseOver={e => this.handleMouseOver(e)}
        onMouseOut={e => this.handleMouseOut(e)}
      >
        <slot onSlotchange={() => this.handleSlotChange()}></slot>
      </div>
    );
  }
}
