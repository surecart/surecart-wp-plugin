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
      template: () => (
        <sc-product-line-item
          currency="CAD"
          fees={
            [
              { amount: -1000, description: 'Test' },
              { amount: 9000, description: 'Test 2' },
            ] as Fee[]
          }
        ></sc-product-line-item>
      ),
    });
    expect(page.root).toMatchSnapshot();
  });

  it('renders trial duration', async () => {
    const page = await newSpecPage({
      components: [ScProductLineItem],
      template: () => <sc-product-line-item currency="CAD" trial-duration-days="30" interval="monthly"></sc-product-line-item>,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('renders trial duration with setup fee', async () => {
    const page = await newSpecPage({
      components: [ScProductLineItem],
      template: () => (
        <sc-product-line-item
          currency="CAD"
          fees={[
            {
              amount: 10000,
              created_at: 1678302886,
              description: 'Paid Trial',
              fee_type: 'setup',
              id: '383dd69d-0700-438a-9fbd-8d62f2181273',
              line_item: 'c25fed66-cbed-4965-b49b-46e190fe2575',
              object: 'fee',
              updated_at: 1678302886,
            },
          ]}
          trial-duration-days="30"
          interval="monthly"
          setup-fee-trial-enabled
        ></sc-product-line-item>
      ),
    });
    expect(page.root).toMatchSnapshot();
  });
  it('renders trial duration without setup fee', async () => {
    const page = await newSpecPage({
      components: [ScProductLineItem],
      template: () => (
        <sc-product-line-item
          currency="CAD"
          fees={[
            {
              amount: 10000,
              created_at: 1678302886,
              description: 'Paid Trial',
              fee_type: 'setup',
              id: '383dd69d-0700-438a-9fbd-8d62f2181273',
              line_item: 'c25fed66-cbed-4965-b49b-46e190fe2575',
              object: 'fee',
              updated_at: 1678302886,
            },
          ]}
          trial-duration-days="30"
          interval="monthly"
        ></sc-product-line-item>
      ),
    });
    expect(page.root).toMatchSnapshot();
  });
});
