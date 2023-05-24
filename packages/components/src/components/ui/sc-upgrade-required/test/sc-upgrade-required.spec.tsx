import { newSpecPage } from '@stencil/core/testing';
import { ScUpgradeRequired } from '../sc-upgrade-required';
import { h } from '@stencil/core';

describe('sc-upgrade-required', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScUpgradeRequired],
      html: `<sc-upgrade-required></sc-upgrade-required>`,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('Should only render children when required is false', async () => {
    const page = await newSpecPage({
      components: [ScUpgradeRequired],
      html: `<sc-upgrade-required><div>Should be rendered</div></sc-upgrade-required>`,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('Should render modal by default when defaultOpen is true', async () => {
    const page = await newSpecPage({
      components: [ScUpgradeRequired],
      template: ()=> <sc-upgrade-required default-open={true}></sc-upgrade-required>,
    });
    expect(page.root).toMatchSnapshot();
  });
});
