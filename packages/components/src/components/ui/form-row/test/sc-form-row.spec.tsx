import { newSpecPage } from '@stencil/core/testing';
import { ScFormRow } from '../sc-form-row';

describe('sc-form-row', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScFormRow],
      html: `<sc-form-row></sc-form-row>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
