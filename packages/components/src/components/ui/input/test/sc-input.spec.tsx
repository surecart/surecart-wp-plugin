import { newSpecPage } from '@stencil/core/testing';
import { ScInput } from '../sc-input';

describe('sc-input', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScInput],
      html: `<sc-input></sc-input>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
