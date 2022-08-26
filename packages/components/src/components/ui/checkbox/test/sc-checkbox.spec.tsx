import { ScCheckbox } from '../sc-checkbox';
import { newSpecPage } from '@stencil/core/testing';

describe('sc-checkbox', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScCheckbox],
      html: `<sc-checkbox></sc-checkbox>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
