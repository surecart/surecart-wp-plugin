import { newSpecPage } from '@stencil/core/testing';
import { ScPhoneInput } from '../sc-phone-input';

describe('sc-phone-input', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScPhoneInput],
      html: `<sc-phone-input></sc-phone-input>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
