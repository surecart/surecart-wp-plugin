import { Component, Prop, Event, EventEmitter, h, State, Method, Watch } from '@stencil/core';

let id = 0;

@Component({
  tag: 'ce-switch',
  styleUrl: 'ce-switch.scss',
  shadow: true,
})
export class CESwitch {
  private input: HTMLInputElement;
  private switchId: string = `switch-${++id}`;
  private labelId = `switch-label-${id}`;

  @State() private hasFocus: boolean = false;

  /** The switch's name attribute. */
  @Prop() name: string;

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

  /** Emitted when the control loses focus. */
  @Event() ceBlur: EventEmitter<void>;

  /** Emitted when the control's checked state changes. */
  @Event() ceChange: EventEmitter<void>;

  /** Emitted when the control gains focus. */
  @Event() ceFocus: EventEmitter<void>;

  /** Checks for validity and shows the browser's validation message if the control is invalid. */
  @Method()
  async reportValidity() {
    this.invalid = !this.input.checkValidity();
    return this.input.reportValidity();
  }

  handleClick() {
    this.checked = !this.checked;
    this.ceChange.emit();
  }

  handleBlur() {
    this.hasFocus = false;
    this.ceBlur.emit();
  }

  handleFocus() {
    this.hasFocus = true;
    this.ceFocus.emit();
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.checked = false;
      this.ceChange.emit();
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.checked = true;
      this.ceChange.emit();
    }
  }

  handleMouseDown(event: MouseEvent) {
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

  render() {
    return (
      <label
        part="base"
        htmlFor={this.switchId}
        class={{
          'switch': true,
          'switch--is-required': this.required,
          'switch--checked': this.checked,
          'switch--disabled': this.disabled,
          'switch--focused': this.hasFocus,
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
            value={this.value}
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
      </label>
    );
  }
}
