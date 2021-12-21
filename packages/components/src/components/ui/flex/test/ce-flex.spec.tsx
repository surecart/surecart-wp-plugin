import { newSpecPage } from '@stencil/core/testing';
import { CeFlex } from '../ce-flex';

describe('ce-flex', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeFlex],
      html: `<ce-flex></ce-flex>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
