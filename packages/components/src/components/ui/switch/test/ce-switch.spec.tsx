import { newSpecPage } from '@stencil/core/testing';
import { CESwitch } from '../ce-switch';

describe('ce-switch', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CESwitch],
      html: `<ce-switch></ce-switch>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
