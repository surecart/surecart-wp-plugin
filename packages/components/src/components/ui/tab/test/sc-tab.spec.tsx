import { newSpecPage } from '@stencil/core/testing';
import { ScTab } from '../sc-tab';

describe('sc-tab', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScTab],
      html: `<sc-tab></sc-tab>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
