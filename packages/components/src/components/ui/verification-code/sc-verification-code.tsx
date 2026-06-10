/**
 * External dependencies.
 */
import { Component, Fragment, h, Element, Method, Prop, State } from '@stencil/core';
import { __ } from '@wordpress/i18n';

@Component({
  tag: 'sc-verification-code',
  styleUrl: 'sc-verification-code.scss',
})
export class ScVerificationCode {
  @Element() el: HTMLScVerificationCodeElement;

  /** Total number of inputs */
  @Prop() total: number = 6;

  /** The verification codes */
  @State() codes: string[] = Array(this.total).fill('');

  /** Whether the component is in a loading/verifying state */
  @Prop() loading: boolean = false;

  /** On change verification code */
  @Prop() onChange: (value: string) => void;

  handleKeyDown(e: KeyboardEvent, index: number) {
    if (e.key === 'Backspace' || e.key === 'Delete') {
      e.preventDefault();
      this.getElementByIndex(index).value = '';
      this.codes = [...this.codes.slice(0, index), '', ...this.codes.slice(index + 1)];
      if (index > 0) {
        this.focusInput(index - 1);
      }
    }
  }

  handleInput(e: InputEvent, index: number) {
    const target = e.target as HTMLInputElement;
    let value = target.value;

    // If value is greater than 1, then put all of the characters to the input one by one (e.g. paste).
    if (value.length > 1) {
      const newCodes = [...this.codes];
      for (let i = 0; i < this.total - index && i < value.length; i++) {
        const input = this.getElementByIndex(index + i);

        // No need to work with focus, we'll add that manually later.
        input.blur();

        input.value = value[i];
        newCodes[index + i] = value[i];
      }
      this.codes = newCodes;

      // Update the index to the last character to be able to continue typing.
      index = index + value.length - 1;

      // Finally update the value to the last character.
      value = value[value.length - 1];
    }

    if (index < this.codes.length) {
      this.codes = [...this.codes.slice(0, index), value, ...this.codes.slice(index + 1)];
    }

    if (index < this.codes.length - 1 && value.length > 0) {
      this.focusInput(index + 1);
    }

    // If it's the last input, unfocus it.
    if (index === this.codes.length - 1 && value.length > 0) {
      this.getElementByIndex(index).blur();
    }

    // Submit the code when all inputs are filled.
    if (this.filledAllInputs()) {
      this.handleCodeChange();
    }
  }

  handleCodeChange() {
    const verificationCode = (this.codes.join('') || '').trim();

    if (verificationCode.length === this.total) {
      this.onChange(verificationCode);
    }
  }

  focusInput(index: number) {
    const input = this.getElementByIndex(index);
    if (input) {
      input.focus();
      input.select();
    }
  }

  /** Focus the first code input. */
  @Method()
  async triggerFocus() {
    this.focusInput(0);
  }

  getElementByIndex(index: number): HTMLInputElement | null {
    return this.el.querySelector(`#code-input-${index}`) as HTMLInputElement;
  }

  handleFocus(e: FocusEvent) {
    const target = e.target as HTMLInputElement;
    target.select();
  }

  reset() {
    this.codes = Array(this.total).fill('');
    this.getElementByIndex(0)?.focus();
  }

  filledAllInputs = () => {
    return this.codes.join('').trim().length === this.total;
  };

  render() {
    return (
      <div class="sc-verification-code">
        {Array.from({ length: this.total }).map((_, index) => (
          <Fragment>
            {index === Math.floor(this.total / 2) && (
              <span class="sc-verification-code__separator" aria-hidden="true">
                &mdash;
              </span>
            )}
            <input
              key={index}
              id={`code-input-${index}`}
              value={!!this.codes[index] ? this.codes[index] : ''}
              onInput={e => this.handleInput(e, index)}
              onKeyDown={e => this.handleKeyDown(e, index)}
              onFocus={e => this.handleFocus(e)}
              autocomplete="one-time-code"
              inputmode="numeric"
              pattern="[0-9]*"
              autofocus={index === 0}
              required
              aria-label={__(`Verification code ${index + 1} of ${this.total}`, 'surecart')}
            />
          </Fragment>
        ))}

        <button type="submit" class="visually-hidden" onClick={() => this.onChange(this.codes.join(''))}>
          {__('Submit', 'surecart')}
        </button>
      </div>
    );
  }
}
