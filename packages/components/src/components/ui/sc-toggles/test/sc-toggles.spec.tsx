import { newSpecPage } from '@stencil/core/testing';
import { ScToggles } from '../sc-toggles';

describe('sc-toggles', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScToggles],
      html: `<sc-toggles></sc-toggles>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
