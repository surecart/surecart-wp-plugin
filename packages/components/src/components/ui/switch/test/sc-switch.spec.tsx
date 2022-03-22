import { newSpecPage } from '@stencil/core/testing';
import { ScSwitch } from '../sc-switch';

describe('sc-switch', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScSwitch],
      html: `<sc-switch></sc-switch>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
