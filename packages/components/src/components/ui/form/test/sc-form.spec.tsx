import { newSpecPage } from '@stencil/core/testing';
import { ScForm } from '../sc-form';

describe('sc-form', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScForm],
      html: `<sc-form></sc-form>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
