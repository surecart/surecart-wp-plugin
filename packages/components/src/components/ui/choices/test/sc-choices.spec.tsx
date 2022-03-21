import { newSpecPage } from '@stencil/core/testing';
import { ScChoices } from '../sc-choices';

describe('sc-choices', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScChoices],
      html: `<sc-choices></sc-choices>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
