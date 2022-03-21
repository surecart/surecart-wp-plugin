import { newSpecPage } from '@stencil/core/testing';
import { CEInput } from '../sc-input';

describe('sc-input', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CEInput],
      html: `<sc-input></sc-input>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
