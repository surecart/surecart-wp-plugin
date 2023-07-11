import { newSpecPage } from '@stencil/core/testing';
import { ScOrderSummary } from '../sc-order-summary';
import { h } from '@stencil/core';
import { state as checkoutStore, dispose } from '@store/checkout';


function mockBodyRects(width = 1000, height = 10000) {
  const bodyRect = { x: 0, y: 0, width, height, top: 0, right: width, bottom: height, left: 0 };
  document.body.getClientRects = jest.fn(() => {
    return {
      item: () => ({...bodyRect,toJSON:()=>bodyRect}),
      length: 1,
      [Symbol.iterator]: jest.fn(),
    };
  });
}
describe('sc-order-summary', () => {
  beforeEach(() => {
    mockBodyRects();
    dispose();
  });
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScOrderSummary],
      html: `<sc-order-summary></sc-order-summary>`,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('renders scratch price if no trial has total savings amount', async () => {
    checkoutStore.checkout = { amount_due: 1000, total_amount: 1000, total_savings_amount: -100 } as any;
    const page = await newSpecPage({
      components: [ScOrderSummary],
      template: () => <sc-order-summary collapsible collapsed></sc-order-summary>,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('does not render scratch price amount_due is different than total_amount', async () => {
    const page = await newSpecPage({
      components: [ScOrderSummary],
      template: () => <sc-order-summary order={{ scratch_amount: 1000, total_amount: 2000, total_savings_amount: -100 } as any} collapsible collapsed></sc-order-summary>,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('should render when collapsible, collapsed on desktop and collapsed in mobile', async () => {
    let page = await newSpecPage({
      components: [ScOrderSummary],
      template: () => <sc-order-summary collapsible collapsedOnDesktop collapsedOnMobile ></sc-order-summary>,
    });
    expect(page.root).toMatchSnapshot();

    mockBodyRects(500, 500);
    page = await newSpecPage({
      components: [ScOrderSummary],
      template: () => <sc-order-summary collapsible collapsedOnDesktop collapsedOnMobile ></sc-order-summary>,
    });

    expect(page.root).toMatchSnapshot();
  });

  it('should render when collapsible, collapsed on desktop and not collapsed in mobile', async () => {
    let page = await newSpecPage({
      components: [ScOrderSummary],
      template: () => <sc-order-summary collapsible collapsedOnDesktop ></sc-order-summary>,
    });
    expect(page.root).toMatchSnapshot();

    mockBodyRects(500, 500);
    page = await newSpecPage({
      components: [ScOrderSummary],
      template: () => <sc-order-summary collapsible collapsedOnDesktop ></sc-order-summary>,
    });

    expect(page.root).toMatchSnapshot();
  });

  it('should render when collapsible, not collapsed on desktop and collapsed in mobile', async () => {
    let page = await newSpecPage({
      components: [ScOrderSummary],
      template: () => <sc-order-summary collapsible collapsedOnMobile ></sc-order-summary>,
    });
    expect(page.root).toMatchSnapshot();

    mockBodyRects(500, 500);
    page = await newSpecPage({
      components: [ScOrderSummary],
      template: () => <sc-order-summary collapsible collapsedOnMobile ></sc-order-summary>,
    });

    expect(page.root).toMatchSnapshot();
  });

  it('should render when collapsible, not collapsed on desktop and not collapsed in mobile', async () => {
    let page = await newSpecPage({
      components: [ScOrderSummary],
      template: () => <sc-order-summary collapsible></sc-order-summary>,
    });
    expect(page.root).toMatchSnapshot();

    mockBodyRects(500, 500);
    page = await newSpecPage({
      components: [ScOrderSummary],
      template: () => <sc-order-summary collapsible></sc-order-summary>,
    });

    expect(page.root).toMatchSnapshot();
  });

  it('should render when not collapsible', async () => {
    let page = await newSpecPage({
      components: [ScOrderSummary],
      template: () => <sc-order-summary></sc-order-summary>,
    });
    expect(page.root).toMatchSnapshot();

    mockBodyRects(500, 500);
    page = await newSpecPage({
      components: [ScOrderSummary],
      template: () => <sc-order-summary></sc-order-summary>,
    });

    expect(page.root).toMatchSnapshot();
  });
});
