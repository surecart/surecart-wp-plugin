import { newSpecPage } from '@stencil/core/testing';
import { ScTooltip } from '../sc-tooltip';

describe('sc-tooltip', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScTooltip],
      html: `<sc-tooltip></sc-tooltip>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
