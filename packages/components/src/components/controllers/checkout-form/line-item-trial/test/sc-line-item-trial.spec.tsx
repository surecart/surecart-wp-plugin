import { newSpecPage } from '@stencil/core/testing';
import { ScLineItemTrial } from '../sc-line-item-trial';

describe('sc-line-item-trial', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScLineItemTrial],
      html: `<sc-line-item-trial></sc-line-item-trial>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
