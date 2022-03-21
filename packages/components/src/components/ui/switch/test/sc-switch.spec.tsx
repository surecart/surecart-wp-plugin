import { newSpecPage } from '@stencil/core/testing';
import { CESwitch } from '../sc-switch';

describe('sc-switch', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CESwitch],
      html: `<sc-switch></sc-switch>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
