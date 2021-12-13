import { newSpecPage } from '@stencil/core/testing';
import { CeTab } from '../ce-tab';

describe('ce-tab', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeTab],
      html: `<ce-tab></ce-tab>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
