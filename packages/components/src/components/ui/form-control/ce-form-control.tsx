import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'ce-form-control',
  styleUrl: 'ce-form-control.scss',
  shadow: true,
})
export class CEFormControl {
  @Prop({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium';
  @Prop() showLabel: boolean = true;
  @Prop() label: string;
  @Prop() labelId: string;
  @Prop() inputId: string;
  @Prop() help: string;
  @Prop() helpId: string;

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
        }}
      >
        <label part="label" id={this.labelId} class="form-control__label" htmlFor={this.inputId} aria-hidden={!!this.label ? 'false' : 'true'}>
          <slot name="label">{this.label}</slot>
        </label>
        <div class="form-control__input">
          <slot></slot>
        </div>
        {this.help && (
          <div part="help-text" id={this.helpId} class="form-control__help-text">
            <slot name="help-text">{this.help}</slot>
          </div>
        )}
      </div>
    );
  }
}
