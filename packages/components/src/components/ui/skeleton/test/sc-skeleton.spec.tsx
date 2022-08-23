import { ScSkeleton } from '../sc-skeleton';
import { newSpecPage } from '@stencil/core/testing';

describe('sc-skeleton', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScSkeleton],
      html: `<sc-skeleton></sc-skeleton>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
