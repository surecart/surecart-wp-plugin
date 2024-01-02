import { newSpecPage } from '@stencil/core/testing';
import { ScRecurringPriceChoiceContainer } from '../sc-recurring-price-choice-container';
import { h } from '@stencil/core';
import { Price } from '../../../../types';
import { __ } from '@wordpress/i18n';

describe('sc-recurring-price-choice-container', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScRecurringPriceChoiceContainer],
      html: `<sc-recurring-price-choice-container></sc-recurring-price-choice-container>`,
    });
    expect(page.root).toMatchSnapshot();
  });
  it('It should render the Price choices with the Label', async function () {
    const page = await newSpecPage({
      components: [ScRecurringPriceChoiceContainer],
      template: () => 
      <sc-recurring-price-choice-container
        label={__('Subscribe and Save', 'surecart')}
        prices={[
          {
            id: '1',
            name: 'Monthly',
            amount: 2900,
            currency: 'usd',
          },
          {
            id: '2',
            name: 'Yearly',
            amount: 20000,
            currency: 'usd',
          },
          {
            id: '3',
            name: 'Weekly',
            amount: 1200,
            currency: 'usd',
          },
        ] as Price[]}
      >
      </sc-recurring-price-choice-container>
    });
    expect(page.root).toMatchSnapshot();
  });
});