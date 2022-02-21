import { newSpecPage } from '@stencil/core/testing';
import { CEForm } from '../ce-form';

describe('ce-form', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CEForm],
      html: `<ce-form></ce-form>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
