import { newSpecPage } from '@stencil/core/testing';
import { ScOrderBumps } from '../sc-order-bumps';

describe('sc-order-bump', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScOrderBumps],
      html: `<sc-order-bumps></sc-order-bumps>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
