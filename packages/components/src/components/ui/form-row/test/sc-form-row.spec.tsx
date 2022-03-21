import { newSpecPage } from '@stencil/core/testing';
import { CEFormRow } from '../sc-form-row';

describe('sc-form-row', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CEFormRow],
      html: `<sc-form-row></sc-form-row>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
