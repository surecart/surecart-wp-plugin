import { newSpecPage } from '@stencil/core/testing';
import { CeRouter } from '../ce-router';

describe('ce-router', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeRouter],
      html: `<ce-router></ce-router>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
