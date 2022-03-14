import { newSpecPage } from '@stencil/core/testing';
import { CeTaxIdInput } from '../ce-order-tax-id-input';

describe('ce-tax-id-input', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeTaxIdInput],
      html: `<ce-tax-id-input></ce-tax-id-input>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
