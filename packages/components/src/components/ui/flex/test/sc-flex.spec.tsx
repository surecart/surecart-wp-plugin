import { newSpecPage } from '@stencil/core/testing';
import { ScFlex } from '../sc-flex';

describe('sc-flex', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScFlex],
      html: `<sc-flex></sc-flex>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
