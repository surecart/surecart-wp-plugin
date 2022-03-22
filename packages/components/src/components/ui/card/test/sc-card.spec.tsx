import { newSpecPage } from '@stencil/core/testing';
import { ScCard } from '../sc-card';

describe('sc-card', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScCard],
      html: `<sc-card></sc-card>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
