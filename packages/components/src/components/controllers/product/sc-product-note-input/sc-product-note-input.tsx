import { Component, Host, h, Prop } from '@stencil/core';
import { state } from '@store/product';
import { setProduct } from '@store/product/setters';
import { __ } from '@wordpress/i18n';

let id = 0;

@Component({
  tag: 'sc-product-note-input',
  styleUrl: 'sc-product-note-input.css',
  shadow: true,
})
export class ScProductNoteInput {
  private inputId: string = `sc-product-note-${++id}`;
  private helpId = `sc-product-note-help-text-${id}`;
  private labelId = `sc-product-note-label-${id}`;

  /** Size of the control */
  @Prop({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium';

  /** Name for the input. Used for validation errors. */
  @Prop() name: string;

  /** Display server-side validation errors. */
  @Prop() errors: any;

  /** Show the label. */
  @Prop() showLabel: boolean = true;

  /** Input label. */
  @Prop() label: string = __('Note', 'surecart');

  /** Whether the input is required. */
  @Prop() required: boolean = false;

  /** Help text */
  @Prop() help: string;

  /** The product id */
  @Prop() productId: string;

  /** Placeholder text */
  @Prop() placeholder: string = __('Add a note (optional)', 'surecart');

  /** Maximum characters allowed */
  @Prop() maxlength: number = 500;

  render() {
    return (
      <Host>
        <sc-form-control
          exportparts="label, help-text, form-control"
          size={this.size}
          required={this.required}
          label={this.label}
          showLabel={this.showLabel}
          help={this.help}
          inputId={this.inputId}
          helpId={this.helpId}
          labelId={this.labelId}
          name={this.name}
        >
          <sc-textarea
            exportparts="base:textarea__base, textarea, form-control:textarea__form-control"
            id={this.inputId}
            size={this.size}
            value={state[this.productId]?.note || ''}
            placeholder={this.placeholder}
            disabled={state[this.productId]?.busy || state[this.productId]?.disabled}
            onScInput={(e: any) => setProduct(this.productId, { note: e.target.value })}
            maxlength={this.maxlength}
            rows={3}
            resize="vertical"
          ></sc-textarea>
        </sc-form-control>
      </Host>
    );
  }
}