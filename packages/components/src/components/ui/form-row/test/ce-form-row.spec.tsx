import { newSpecPage } from '@stencil/core/testing';
import { CEFormRow } from '../ce-form-row';

describe('ce-form-row', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CEFormRow],
      html: `<ce-form-row></ce-form-row>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
