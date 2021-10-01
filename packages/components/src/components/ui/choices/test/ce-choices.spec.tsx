import { newSpecPage } from '@stencil/core/testing';
import { CEChoices } from '../ce-choices';

describe('ce-choices', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CEChoices],
      html: `<ce-choices></ce-choices>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
