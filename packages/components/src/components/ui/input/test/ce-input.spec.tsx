import { newSpecPage } from '@stencil/core/testing';
import { CEInput } from '../ce-input';

describe('ce-input', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CEInput],
      html: `<ce-input></ce-input>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
