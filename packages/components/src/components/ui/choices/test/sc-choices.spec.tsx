import { newSpecPage } from '@stencil/core/testing';
import { CEChoices } from '../sc-choices';

describe('sc-choices', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CEChoices],
      html: `<sc-choices></sc-choices>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
