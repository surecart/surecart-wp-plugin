import { newSpecPage } from '@stencil/core/testing';
import { CEButton } from '../ce-button';

describe('ce-button', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CEButton],
      html: '<ce-button></ce-button>',
    });
    expect(page.root).toMatchSnapshot();
  });

  it('renders slots', async () => {
    const page = await newSpecPage({
      components: [CEButton],
      html: `<ce-button>
        <span slot="prefix">Prefix</span>
        Text
        <span slot="suffix">Suffix</span>
      </ce-button>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
