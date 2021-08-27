import { Component, h, Prop, Watch, Element } from '@stencil/core';

@Component({
  tag: 'ce-form-control',
  styleUrl: 'ce-form-control.scss',
  shadow: true,
})
export class CEFormControl {
  @Element() el: HTMLCeFormControlElement;

  @Prop({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium';
  @Prop() showLabel: boolean = true;
  @Prop() label: string;
  @Prop() labelId: string;
  @Prop() inputId: string;
  @Prop() help: string;
  @Prop() helpId: string;
  @Prop() errorMessages: Array<string> = [];

  @Watch('errorMessages')
  handleErrorMessages(val) {
    // let slotted = this.el.shadowRoot.querySelector('slot') as HTMLSlotElement;
    // return (slotted.assignedNodes().find(node => {
    //   return node.nodeName === 'ce-menu';
    // }) as unknown) as CEMenu;
  }

  componentDidLoad() {
    this.el.firstElementChild.setAttribute('isvalid', 'true');
  }

  render() {
    return (
      <div
        part="form-control"
        class={{
          'form-control': true,
          'form-control--small': this.size === 'small',
          'form-control--medium': this.size === 'medium',
          'form-control--large': this.size === 'large',
          'form-control--has-label': !!this.label && this.showLabel,
          'form-control--has-help-text': !!this.help,
          'form-control--has-error': !!this.errorMessages.length,
        }}
      >
        <label part="label" id={this.labelId} class="form-control__label" htmlFor={this.inputId} aria-hidden={!!this.label ? 'false' : 'true'}>
          <slot name="label">{this.label}</slot>
        </label>
        <div class="form-control__input">
          <slot></slot>
        </div>
        {!!this.errorMessages.length && (
          <div part="error-messages" id={this.helpId} class="form-control__error-text">
            <slot name="error-text">{this.help}</slot>
          </div>
        )}
        {this.help && (
          <div part="help-text" id={this.helpId} class="form-control__help-text">
            <slot name="help-text">{this.help}</slot>
          </div>
        )}
      </div>
    );
  }
}
