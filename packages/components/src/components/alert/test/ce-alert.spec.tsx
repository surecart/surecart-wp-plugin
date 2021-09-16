import { newSpecPage } from '@stencil/core/testing';
import { CeAlert } from '../ce-alert';

describe('ce-alert', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeAlert],
      html: `<ce-alert></ce-alert>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
