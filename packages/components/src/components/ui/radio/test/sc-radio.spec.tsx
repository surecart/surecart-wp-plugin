import { ScRadio } from '../sc-radio';
import { newSpecPage } from '@stencil/core/testing';

describe('sc-radio', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScRadio],
      html: `<sc-radio></sc-radio>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
