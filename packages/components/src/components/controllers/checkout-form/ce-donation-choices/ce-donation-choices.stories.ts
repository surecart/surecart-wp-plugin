import { LineItem, Price } from '../../../../types';

export default {
  title: 'Components/Donation Choices',
};

const Template = ({ loading, priceId, amount, ad_hoc_max_amount, ad_hoc_min_amount }) => {
  setTimeout(() => {
    const donation = document.querySelector('ce-donation-choices');
    donation.lineItems = [
      {
        price: {
          id: 'test',
          amount,
          ad_hoc_max_amount,
          ad_hoc_min_amount,
        } as Price,
      } as LineItem,
    ];
  });

  return `<ce-donation-choices label="Donation Amount" ${loading && 'loading'} price-id=${priceId}>
  <div>
  <ce-choice show-control="false" size="small" value="100">
  <ce-format-number type="currency" currency="usd" value="100" minimum-fraction-digits="0"></ce-format-number>
  </ce-choice>
  <ce-choice show-control="false" size="small" value="200">
  <ce-format-number type="currency" currency="usd" value="200" minimum-fraction-digits="0"></ce-format-number>
  </ce-choice>
  <ce-choice show-control="false" size="small" value="500">
  <ce-format-number type="currency" currency="usd" value="500" minimum-fraction-digits="0"></ce-format-number>
  </ce-choice>
  <ce-choice show-control="false" size="small" value="1000">
  <ce-format-number type="currency" currency="usd" value="1000" minimum-fraction-digits="0"></ce-format-number>
  </ce-choice>
  <ce-choice show-control="false" size="small" value="2000">
  <ce-format-number type="currency" currency="usd" value="2000" minimum-fraction-digits="0"></ce-format-number>
  </ce-choice>
  <ce-choice show-control="false" size="small" value="5000">
  <ce-format-number type="currency" currency="usd" value="5000" minimum-fraction-digits="0"></ce-format-number>
  </ce-choice>
  <ce-choice show-control="false" size="small" value="10000">
  <ce-format-number type="currency" currency="usd" value="10000" minimum-fraction-digits="0"></ce-format-number>
  </ce-choice>
  <ce-choice show-control="false" size="small" value="10000">
  <ce-format-number type="currency" currency="usd" value="10000" minimum-fraction-digits="0"></ce-format-number>
  </ce-choice>
  <ce-choice show-control="false" size="small" value="20000">
  <ce-format-number type="currency" currency="usd" value="20000" minimum-fraction-digits="0"></ce-format-number>
  </ce-choice>
  <ce-choice show-control="false" size="small" value="50000">
  <ce-format-number type="currency" currency="usd" value="50000" minimum-fraction-digits="0"></ce-format-number>
  </ce-choice>
  <ce-choice show-control="false" size="small" value="ad_hoc">
Other
  </ce-choice>
  </div>
    </ce-donation-choices>
`;
};

export const Default = Template.bind({});
Default.args = {
  loading: false,
  busy: false,
  priceId: 'test',
  amount: 1000,
};

export const CustomAmount = Template.bind({});
CustomAmount.args = {
  loading: false,
  busy: false,
  priceId: 'test',
  amount: 12345,
};

export const RemoveChoices = Template.bind({});
RemoveChoices.args = {
  loading: false,
  busy: false,
  priceId: 'test',
  amount: 1000,
  ad_hoc_min_amount: 100,
  ad_hoc_max_amount: 200,
};
