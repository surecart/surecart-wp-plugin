import { newSpecPage } from '@stencil/core/testing';
import { ScButtonGroup } from '../sc-button-group';

describe('sc-button-group', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScButtonGroup],
      html: `<sc-button-group></sc-button-group>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
