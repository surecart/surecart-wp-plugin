/**
 * External dependencies.
 */
import { Component, h, Element, Prop, State, Watch } from '@stencil/core';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { state as userState, onChange as onUserChange } from '@store/user';
import { CODE_SENT, VERIFYING } from '@store/user/constants';

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

  /** Verification status */
  @State() verificationStatus: string = userState.verificationStatus;

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
      for (let i = 0; i < this.total - index; i++) {
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

    // Submit the code, only for the last input changes.
    if (index === this.codes.length - 1) {
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

  private removeUserListener: () => void;

  componentWillLoad() {
    this.removeUserListener = onUserChange('verificationStatus', val => {
      this.verificationStatus = val;
    });
  }

  disconnectedCallback() {
    this.removeUserListener?.();
  }

  @Watch('verificationStatus')
  resetAfterCodeWatches() {
    if (this.verificationStatus === CODE_SENT) {
      this.reset();
      return;
    }
    this.getElementByIndex(0)?.focus();
  }

  renderDummyInput() {
    return (
      <input
        style={{
          visibility: 'hidden',
        }}
        aria-hidden="true"
      />
    );
  }

  filledAllInputs = () => {
    return this.codes.join('').trim().length === this.total;
  };

  render() {
    return (
      <div class="sc-verification-code">
        {/* Hidden inputs to prevent browser autofill from targeting verification code fields */}
        {this.renderDummyInput()}
        {this.renderDummyInput()}
        {Array.from({ length: this.total }).map((_, index) => (
          <input
            key={index}
            id={`code-input-${index}`}
            value={!!this.codes[index] ? this.codes[index] : ''}
            onInput={e => this.handleInput(e, index)}
            onKeyDown={e => this.handleKeyDown(e, index)}
            onFocus={e => this.handleFocus(e)}
            autocomplete="one-time-code"
            autofocus={index === 0}
            required
            aria-label={__(`Verification code ${index + 1} of ${this.total}`, 'surecart')}
          />
        ))}
        <sc-tooltip
          text={__('Clear code', 'surecart')}
          type="text"
          style={{ display: 'inline-block', cursor: 'help', height: '36px', visibility: this.filledAllInputs() ? 'visible' : 'hidden' }}
        >
          <sc-button type="text" onClick={() => this.reset()} loading={userState.verificationStatus === VERIFYING}>
            <sc-icon name="x-circle" />
          </sc-button>
        </sc-tooltip>
        {this.renderDummyInput()}

        <button type="submit" class="visually-hidden" onClick={() => this.onChange(this.codes.join(''))}>
          {__('Submit', 'surecart')}
        </button>
      </div>
    );
  }
}
