import { newSpecPage } from '@stencil/core/testing';
import { CeHeading } from '../ce-heading';

describe('ce-heading', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeHeading],
      html: `<ce-heading></ce-heading>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
