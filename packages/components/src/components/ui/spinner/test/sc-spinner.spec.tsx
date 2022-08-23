import { ScSpinner } from '../sc-spinner';
import { newSpecPage } from '@stencil/core/testing';

describe('sc-spinner', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScSpinner],
      html: `<sc-spinner></sc-spinner>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
