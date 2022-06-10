import { Component, h, State, Prop, Element, Watch, Event, EventEmitter } from '@stencil/core';

let id = 0;

@Component({
  tag: 'sc-textarea',
  styleUrl: 'sc-textarea.css',
  shadow: true,
})
export class ScTextarea {
  private inputId: string = `textarea-${++id}`;
  private helpId = `textarea-help-text-${id}`;
  private labelId = `textarea-label-${id}`;

  @Element() el: HTMLScTextareaElement;

  private input: HTMLTextAreaElement;
  private resizeObserver: ResizeObserver;

  @State() private hasFocus = false;

  /** The textarea's size. */
  @Prop({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium';

  /** The textarea's name attribute. */
  @Prop() name: string;

  /** The textarea's value attribute. */
  @Prop() value = '';

  /** Draws a filled textarea. */
  @Prop({ reflect: true }) filled: boolean = false;

  /** The textarea's label. Alternatively, you can use the label slot. */
  @Prop() label = '';

  /** Should we show the label */
  @Prop() showLabel: boolean = true;

  /** The textarea's help text. Alternatively, you can use the help-text slot. */
  @Prop({ attribute: 'help-text' }) help = '';

  /** The textarea's placeholder text. */
  @Prop() placeholder: string;

  /** The number of rows to display by default. */
  @Prop() rows: number = 4;

  /** Controls how the textarea can be resized. */
  @Prop() resize: 'none' | 'vertical' | 'auto' = 'vertical';

  /** Disables the textarea. */
  @Prop({ reflect: true }) disabled: boolean = false;

  /** Makes the textarea readonly. */
  @Prop({ reflect: true }) readonly: boolean = false;

  /** The minimum length of input that will be considered valid. */
  @Prop() minlength: number;

  /** The maximum length of input that will be considered valid. */
  @Prop() maxlength: number;

  /** Makes the textarea a required field. */
  @Prop({ reflect: true }) required: boolean = false;

  /**
   * This will be true when the control is in an invalid state. Validity is determined by props such as `type`,
   * `required`, `minlength`, and `maxlength` using the browser's constraint validation API.
   */
  @Prop({ reflect: true }) invalid: boolean = false;

  /** The textarea's autocapitalize attribute. */
  @Prop() autocapitalize: 'off' | 'none' | 'on' | 'sentences' | 'words' | 'characters';

  /** The textarea's autocorrect attribute. */
  @Prop() autocorrect: string;

  /** The textarea's autocomplete attribute. */
  @Prop() autocomplete: string;

  /** The textarea's autofocus attribute. */
  @Prop() autofocus: boolean;

  /**
   * The input's enterkeyhint attribute. This can be used to customize the label or icon of the Enter key on virtual
   * keyboards.
   */
  @Prop() enterkeyhint: 'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send';

  /** Enables spell checking on the textarea. */
  @Prop() spellcheck: boolean;

  /** The textarea's inputmode attribute. */
  @Prop() inputmode: 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url';

  @Event() scChange: EventEmitter<void>;
  @Event() scInput: EventEmitter<void>;
  @Event() scBlur: EventEmitter<void>;
  @Event() scFocus: EventEmitter<void>;

  @Watch('rows')
  handleRowsChange() {
    this.setTextareaHeight();
  }

  @Watch('value')
  handleValueChange() {
    this.invalid = !this.input.checkValidity();
  }

  @Watch('disabled')
  handleDisabledChange() {
    // Disabled form controls are always valid, so we need to recheck validity when the state changes
    this.input.disabled = this.disabled;
    this.invalid = !this.input.checkValidity();
  }

  disconnectedCallback() {
    this.resizeObserver.unobserve(this.input);
  }

  /** Sets focus on the textarea. */
  focus(options?: FocusOptions) {
    this.input.focus(options);
  }

  /** Removes focus from the textarea. */
  blur() {
    this.input.blur();
  }

  /** Selects all the text in the textarea. */
  select() {
    this.input.select();
  }

  /** Gets or sets the textarea's scroll position. */
  scrollPosition(position?: { top?: number; left?: number }): { top: number; left: number } | undefined {
    if (position) {
      if (typeof position.top === 'number') this.input.scrollTop = position.top;
      if (typeof position.left === 'number') this.input.scrollLeft = position.left;
      return;
    }

    // eslint-disable-next-line consistent-return
    return {
      top: this.input.scrollTop,
      left: this.input.scrollTop,
    };
  }

  /** Sets the start and end positions of the text selection (0-based). */
  setSelectionRange(selectionStart: number, selectionEnd: number, selectionDirection: 'forward' | 'backward' | 'none' = 'none') {
    this.input.setSelectionRange(selectionStart, selectionEnd, selectionDirection);
  }

  /** Replaces a range of text with a new string. */
  setRangeText(replacement: string, start: number, end: number, selectMode: 'select' | 'start' | 'end' | 'preserve' = 'preserve') {
    this.input.setRangeText(replacement, start, end, selectMode);

    if (this.value !== this.input.value) {
      this.value = this.input.value;
      this.scInput.emit();
    }

    if (this.value !== this.input.value) {
      this.value = this.input.value;
      this.setTextareaHeight();
      this.scInput.emit();
      this.scChange.emit();
    }
  }

  /** Checks for validity and shows the browser's validation message if the control is invalid. */
  reportValidity() {
    return this.input.reportValidity();
  }

  /** Sets a custom validation message. If `message` is not empty, the field will be considered invalid. */
  setCustomValidity(message: string) {
    this.input.setCustomValidity(message);
    this.invalid = !this.input.checkValidity();
  }

  handleBlur() {
    this.hasFocus = false;
    this.scBlur.emit();
  }

  handleChange() {
    this.value = this.input.value;
    this.setTextareaHeight();
    this.scChange.emit();
  }

  handleFocus() {
    this.hasFocus = true;
    this.scFocus.emit();
  }

  handleInput() {
    this.value = this.input.value;
    this.setTextareaHeight();
    this.scInput.emit();
  }

  componentWillLoad() {
    this.resizeObserver = new ResizeObserver(() => this.setTextareaHeight());
  }

  componentDidLoad() {
    this.resizeObserver.observe(this.input);
  }

  setTextareaHeight() {
    if (this.resize === 'auto') {
      this.input.style.height = 'auto';
      this.input.style.height = `${this.input.scrollHeight}px`;
    } else {
      (this.input.style.height as string | undefined) = undefined;
    }
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
        }}
      >
        <sc-form-control
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
          <div part="form-control-input" class="form-control-input">
            <div
              part="base"
              class={{
                'textarea': true,
                'textarea--small': this.size === 'small',
                'textarea--medium': this.size === 'medium',
                'textarea--large': this.size === 'large',
                'textarea--standard': !this.filled,
                'textarea--filled': this.filled,
                'textarea--disabled': this.disabled,
                'textarea--focused': this.hasFocus,
                'textarea--empty': !this.value,
                'textarea--invalid': this.invalid,
                'textarea--resize-none': this.resize === 'none',
                'textarea--resize-vertical': this.resize === 'vertical',
                'textarea--resize-auto': this.resize === 'auto',
              }}
            >
              <textarea
                part="textarea"
                ref={el => (this.input = el as HTMLTextAreaElement)}
                id="input"
                class="textarea__control"
                name={this.name}
                value={this.value}
                disabled={this.disabled}
                readonly={this.readonly}
                required={this.required}
                placeholder={this.placeholder}
                rows={this.rows}
                minlength={this.minlength}
                maxlength={this.maxlength}
                autocapitalize={this.autocapitalize}
                autocorrect={this.autocorrect}
                autofocus={this.autofocus}
                spellcheck={this.spellcheck}
                enterkeyhint={this.enterkeyhint}
                inputmode={this.inputmode}
                aria-describedby="help-text"
                onChange={() => this.handleChange()}
                onInput={() => this.handleInput()}
                onFocus={() => this.handleFocus()}
                onBlur={() => this.handleBlur()}
              ></textarea>
            </div>
          </div>
        </sc-form-control>
      </div>
    );
  }
}
