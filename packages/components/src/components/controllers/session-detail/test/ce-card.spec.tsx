import { newSpecPage } from '@stencil/core/testing';
import { CeSessionDetail } from '../ce-session-detail';

describe('ce-session-detail', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeSessionDetail],
      html: `<ce-session-detail></ce-session-detail>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
