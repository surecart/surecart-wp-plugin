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
});
