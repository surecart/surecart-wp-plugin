import { ScDivider } from '../sc-divider';
import { newSpecPage } from '@stencil/core/testing';

describe('sc-divider', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScDivider],
      html: `<sc-divider></sc-divider>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
