import { newSpecPage } from '@stencil/core/testing';
import { ScVerificationCode } from '../sc-verification-code';

describe('sc-verification-code', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScVerificationCode],
      html: `<sc-verification-code></sc-verification-code>`,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('renders with total', async () => {
    const page = await newSpecPage({
      components: [ScVerificationCode],
      html: `<sc-verification-code total="4"></sc-verification-code>`,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('renders 6 code inputs by default', async () => {
    const page = await newSpecPage({
      components: [ScVerificationCode],
      html: `<sc-verification-code></sc-verification-code>`,
    });
    const inputs = page.root.querySelectorAll('input[id^="code-input-"]');
    expect(inputs.length).toBe(6);
  });

  it('renders inputs with numeric inputmode and pattern', async () => {
    const page = await newSpecPage({
      components: [ScVerificationCode],
      html: `<sc-verification-code></sc-verification-code>`,
    });
    const input = page.root.querySelector('#code-input-0') as HTMLInputElement;
    expect(input.getAttribute('inputmode')).toBe('numeric');
    expect(input.getAttribute('pattern')).toBe('[0-9]*');
  });

  it('renders inputs with aria-labels', async () => {
    const page = await newSpecPage({
      components: [ScVerificationCode],
      html: `<sc-verification-code></sc-verification-code>`,
    });
    const input = page.root.querySelector('#code-input-0') as HTMLInputElement;
    expect(input.getAttribute('aria-label')).toContain('1 of 6');
    const lastInput = page.root.querySelector('#code-input-5') as HTMLInputElement;
    expect(lastInput.getAttribute('aria-label')).toContain('6 of 6');
  });

  it('advances focus on single character input', async () => {
    const page = await newSpecPage({
      components: [ScVerificationCode],
      html: `<sc-verification-code></sc-verification-code>`,
    });
    const firstInput = page.root.querySelector('#code-input-0') as HTMLInputElement;
    const secondInput = page.root.querySelector('#code-input-1') as HTMLInputElement;

    const focusSpy = jest.spyOn(secondInput, 'focus');

    firstInput.value = '1';
    firstInput.dispatchEvent(new Event('input'));
    await page.waitForChanges();

    expect(focusSpy).toHaveBeenCalled();
  });

  it('moves focus back on backspace', async () => {
    const page = await newSpecPage({
      components: [ScVerificationCode],
      html: `<sc-verification-code></sc-verification-code>`,
    });
    const secondInput = page.root.querySelector('#code-input-1') as HTMLInputElement;
    const firstInput = page.root.querySelector('#code-input-0') as HTMLInputElement;

    const focusSpy = jest.spyOn(firstInput, 'focus');

    secondInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));
    await page.waitForChanges();

    expect(focusSpy).toHaveBeenCalled();
  });

  it('calls onChange when all inputs are filled', async () => {
    const onChangeMock = jest.fn();
    const page = await newSpecPage({
      components: [ScVerificationCode],
      html: `<sc-verification-code></sc-verification-code>`,
    });
    const component = page.rootInstance as ScVerificationCode;
    component.onChange = onChangeMock;

    // Fill inputs one by one via dispatching input events.
    for (let i = 0; i < 6; i++) {
      const input = page.root.querySelector(`#code-input-${i}`) as HTMLInputElement;
      input.value = String(i + 1);
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
    await page.waitForChanges();

    expect(onChangeMock).toHaveBeenCalledWith('123456');
  });

  it('resets all codes when reset is called', async () => {
    const page = await newSpecPage({
      components: [ScVerificationCode],
      html: `<sc-verification-code></sc-verification-code>`,
    });
    const component = page.rootInstance as ScVerificationCode;

    // Fill codes manually.
    component.codes = ['1', '2', '3', '4', '5', '6'];
    component.reset();
    await page.waitForChanges();

    expect(component.codes).toEqual(['', '', '', '', '', '']);
  });
});
