import { newSpecPage } from '@stencil/core/testing';
import { ScButton } from '../sc-button';

describe('sc-button', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScButton],
      html: '<sc-button></sc-button>',
    });
    expect(page.root).toMatchSnapshot();
  });

  it('renders slots', async () => {
    const page = await newSpecPage({
      components: [ScButton],
      html: `<sc-button>
        <span slot="prefix">Prefix</span>
        Text
        <span slot="suffix">Suffix</span>
      </sc-button>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
