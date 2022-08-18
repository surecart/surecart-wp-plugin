import { ScLineItem } from '../sc-line-item';
import { newSpecPage } from '@stencil/core/testing';

describe('sc-line-item', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScLineItem],
      html: `<sc-line-item></sc-line-item>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
