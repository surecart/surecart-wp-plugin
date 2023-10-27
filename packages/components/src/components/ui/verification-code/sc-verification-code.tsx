/**
 * External dependencies.
 */
import { Component, h, Element, Prop, State, Listen, Host } from '@stencil/core';

@Component({
  tag: 'sc-verification-code',
  styleUrl: 'sc-verification-code.scss',
  shadow: true,
})
export class ScVerificationCode {
  @Element() el: HTMLScVerificationCodeElement;

  /** Total number of inputs */
  @Prop() total: number = 6;

  /** The verification codes */
  @State() codes: string[] = Array(this.total).fill('');

  /** On change verification code */
  @Prop() onChange: (value: string) => void;

  @Listen('keydown')
  handleKeyDown(e: KeyboardEvent, index: number) {
    if ((e.key === 'Backspace' || e.key === 'Delete') && index > 0) {
      e.preventDefault();

      const input = this.getElementByIndex(index);
      input.value = '';
      this.focusInput(index - 1);
    }
  }

  handleInput(e: InputEvent, index: number) {
    const target = e.target as HTMLInputElement;
    const value = target.value;

    // If value is greater than 1, then put all of the characters to the input one by one.
    if (value.length > 1) {
      const valueLength = value.length;
      for (let i = 0; i < this.total; i++) {
        const input = this.getElementByIndex(index + i);
        input.value = value[i];
        this.codes[index + i] = value[i];

        // remove focus
        if (i === valueLength - 1) {
          input.blur();
        }
      }

      // Update the index to the last character to be able to continue typing.
      index = index + valueLength - 1;
    } else {
      target.value = value;
    }

    if (index < this.codes.length) {
      this.codes[index] = value;
    }

    if (index < this.codes.length - 1 && value.length > 0) {
      this.focusInput(index + 1);
    }

    // If it's the last input, unfocus it.
    if (index === this.codes.length - 1 && value.length > 0) {
      this.getElementByIndex(index).blur();
    }

    this.handleCodeChange();
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
    return this.el.shadowRoot.querySelector(`.code-input-${index}`) as HTMLInputElement;
  }

  handleFocus(e: FocusEvent) {
    const target = e.target as HTMLInputElement;
    target.select();
  }

  // on component load, focus the first input
  componentWillLoad() {
    this.focusInput(0);
  }

  render() {
    return (
      <Host>
        <div class="verification-code-area">
          {this.codes.map((value, index) => (
            <input
              key={index}
              class={`code-input code-input-${index}`}
              value={value}
              onInput={e => this.handleInput(e, index)}
              onKeyDown={e => this.handleKeyDown(e, index)}
              onFocus={e => this.handleFocus(e)}
              required
            />
          ))}
        </div>
      </Host>
    );
  }
}
