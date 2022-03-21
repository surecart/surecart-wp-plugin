import { newSpecPage } from '@stencil/core/testing';
import { ScAlert } from '../sc-alert';

describe('sc-alert', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScAlert],
      html: `<sc-alert></sc-alert>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
