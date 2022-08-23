import { ScDownloadsList } from '../sc-downloads-list';
import { newSpecPage } from '@stencil/core/testing';

describe('sc-purchase', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScDownloadsList],
      html: `<sc-downloads-list></sc-downloads-list>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
