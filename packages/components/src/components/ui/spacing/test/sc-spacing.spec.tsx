import { newSpecPage } from '@stencil/core/testing';
import { ScSpacing } from '../sc-spacing';

describe('sc-spacing', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScSpacing],
      html: `<sc-spacing></sc-spacing>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
