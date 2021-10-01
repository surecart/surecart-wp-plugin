import { newSpecPage } from '@stencil/core/testing';
import { CeTooltip } from '../ce-tooltip';

describe('ce-tooltip', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeTooltip],
      html: `<ce-tooltip></ce-tooltip>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
