import { newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';
import { ScPayment } from '../sc-payment';
import { Processor } from '../../../../../types';

describe('sc-payment', () => {
  it('renders no processors', async () => {
    const page = await newSpecPage({
      components: [ScPayment],
      html: `<sc-payment></sc-payment>`,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('renders stripe and paypal', async () => {
    const page = await newSpecPage({
      components: [ScPayment],
      template: () => (
        <sc-payment
          processors={[
            { processor_type: 'stripe', live_mode: true } as Processor,
            { processor_type: 'paypal', live_mode: true } as Processor,
          ]}
        ></sc-payment>
      ),
    });
    expect(page.root).toMatchSnapshot();
  });

  it('renders stripe and hides paypal if recurring', async () => {
    const page = await newSpecPage({
      components: [ScPayment],
      template: () => (
        <sc-payment
          processors={[
            { processor_type: 'stripe', live_mode: true } as Processor,
            { processor_type: 'paypal', live_mode: true } as Processor,
          ]}
          order={
            {
              line_items: {
                data: [
                  {
                    price: {
                      product: {
                        recurring: true,
                      },
                    },
                  },
                ],
              },
            } as any
          }
        ></sc-payment>
      ),
    });
    expect(page.root).toMatchSnapshot();
  });

  it('renders paypal only', async () => {
    const page = await newSpecPage({
      components: [ScPayment],
      template: () => <sc-payment processors={[{ processor_type: 'paypal', live_mode: true }] as Processor[]}></sc-payment>,
    });
    expect(page.root).toMatchSnapshot();
  });
  it('renders stripe only', async () => {
    const page = await newSpecPage({
      components: [ScPayment],
      template: () => <sc-payment processors={[{ processor_type: 'stripe', live_mode: true }] as Processor[]}></sc-payment>,
    });
    expect(page.root).toMatchSnapshot();
  });
});
