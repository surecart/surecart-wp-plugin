import { newSpecPage } from '@stencil/core/testing';
import { CEForm } from '../sc-form';

describe('sc-form', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CEForm],
      html: `<sc-form></sc-form>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
