import { Component, Prop, Event, EventEmitter, h, State, Watch, Element, Method } from '@stencil/core';
import { FormSubmitController } from '../../../functions/form-data';

let id = 0;

@Component({
  tag: 'sc-switch',
  styleUrl: 'sc-switch.scss',
  shadow: true,
})
export class ScSwitch {
  @Element() el: HTMLScSwitchElement;
  private formController: any;
  private input: HTMLInputElement;
  private switchId: string = `switch-${++id}`;
  private labelId = `switch-label-${id}`;
  /** Does it have a description? */
  @State() hasDescription: boolean;

  @State() private hasFocus: boolean = false;

  /** The switch's name attribute. */
  @Prop({ reflect: true }) name: string;

  /** The switch's value attribute. */
  @Prop() value: string;

  /** Disables the switch. */
  @Prop({ reflect: true }) disabled: boolean = false;

  /** Makes the switch a required field. */
  @Prop({ reflect: true }) required: boolean = false;

  /** Draws the switch in a checked state. */
  @Prop({ reflect: true, mutable: true }) checked: boolean = false;

  /** This will be true when the control is in an invalid state. Validity is determined by the `required` prop. */
  @Prop({ reflect: true, mutable: true }) invalid: boolean = false;

  @Prop() reversed: boolean;

  /** This will be true as a workaround in the block editor to focus on the content. */
  @Prop() edit: boolean = false;

  /** Emitted when the control loses focus. */
  @Event() scBlur: EventEmitter<void>;

  /** Emitted when the control's checked state changes. */
  @Event() scChange: EventEmitter<void>;

  /** Emitted when the control gains focus. */
  @Event() scFocus: EventEmitter<void>;

  /** Checks for validity and shows the browser's validation message if the control is invalid. */
  @Method()
  async reportValidity() {
    this.invalid = !this.input.checkValidity();
    return this.input.reportValidity();
  }

  handleClick() {
    this.checked = !this.checked;
    this.scChange.emit();
  }

  handleBlur() {
    this.hasFocus = false;
    this.scBlur.emit();
  }

  handleFocus() {
    this.hasFocus = true;
    this.scFocus.emit();
  }

  handleKeyDown(event: KeyboardEvent) {
    if (this.edit) return true;

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.checked = false;
      this.scChange.emit();
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.checked = true;
      this.scChange.emit();
    }
  }

  handleMouseDown(event: MouseEvent) {
    if (this.edit) return true;

    // Prevent clicks on the label from briefly blurring the input
    event.preventDefault();
    this.input.focus();
  }

  @Watch('checked')
  handleCheckedChange() {
    if (this.input) {
      this.input.checked = this.checked;
      this.invalid = !this.input.checkValidity();
    }
  }

  componentDidLoad() {
    this.formController = new FormSubmitController(this.el, {
      value: (control: HTMLScChoiceElement) => (control.checked ? control.value : undefined),
    }).addFormData();
    this.hasDescription = !!this.el.querySelector('[slot="suffix"]');
  }

  disconnectedCallback() {
    this.formController?.removeFormData();
  }

  render() {
    const Tag = this.edit ? 'div' : 'label';
    return (
      <Tag
        part="base"
        htmlFor={this.switchId}
        class={{
          'switch': true,
          'switch--is-required': this.required,
          'switch--checked': this.checked,
          'switch--disabled': this.disabled,
          'switch--focused': this.hasFocus,
          'switch--reversed': this.reversed,
          'switch--editing': this.edit,
          'switch--has-description': this.hasDescription,
        }}
        onMouseDown={e => this.handleMouseDown(e)}
      >
        <span part="control" class="switch__control">
          <span part="thumb" class="switch__thumb"></span>
          <input
            ref={el => (this.input = el as HTMLInputElement)}
            id={this.switchId}
            type="checkbox"
            role="switch"
            name={this.name}
            value={this.value || 'on'}
            checked={this.checked}
            disabled={this.disabled}
            required={this.required}
            aria-checked={this.checked ? 'true' : 'false'}
            aria-labelledby={this.labelId}
            onClick={() => this.handleClick()}
            onBlur={() => this.handleBlur()}
            onFocus={() => this.handleFocus()}
            onKeyDown={e => this.handleKeyDown(e)}
          />
        </span>
        <span class="switch__label">
          <span part="title" id={this.labelId} class="switch__title">
            <slot></slot>
          </span>
          <span class="switch__description" part="description">
            <slot name="description"></slot>
          </span>
        </span>
      </Tag>
    );
  }
}
