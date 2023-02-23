import { newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';
import { Fee } from '../../../../types';
import { ScProductLineItem } from '../sc-product-line-item';

describe('sc-product-line-item', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScProductLineItem],
      html: `<sc-product-line-item currency="CAD" amount="1000"></sc-product-line-item>`,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('renders scratch amount if different from amount', async () => {
    const page = await newSpecPage({
      components: [ScProductLineItem],
      html: `<sc-product-line-item currency="CAD" amount="1000" scratch-amount="2000"></sc-product-line-item>`,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('does not render scratch amount if the same as amount', async () => {
    const page = await newSpecPage({
      components: [ScProductLineItem],
      html: `<sc-product-line-item currency="CAD" amount="1000" scratch-amount="1000"></sc-product-line-item>`,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('renders fees', async () => {
    const page = await newSpecPage({
      components: [ScProductLineItem],
      template: () => <sc-product-line-item currency="CAD" fees={[{amount: -1000, description: 'Test'},{amount: 9000, description: 'Test 2'} ] as Fee[]}></sc-product-line-item>
    });
    expect(page.root).toMatchSnapshot();
  })
});
