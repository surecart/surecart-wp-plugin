import { newSpecPage } from '@stencil/core/testing';
import { ScHeading } from '../sc-heading';

describe('sc-heading', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScHeading],
      html: `<sc-heading></sc-heading>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
