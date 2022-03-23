export default {
  title: 'Components/Checkout/Custom Order Price Input',
};

const Template = ({ loading, label, help, amount, currency, ad_hoc_max_amount, ad_hoc_min_amount }) => {
  setTimeout(() => {
    const input = document.querySelector('sc-custom-order-price-input');
    input.price = {
      id: 'test',
      amount,
      currency,
      ad_hoc_max_amount,
      ad_hoc_min_amount,
    } as any;
  });

  return `<sc-custom-order-price-input ${loading && 'loading'} label="${label}" help="${help}"></sc-custom-order-price-input>`;
};

export const Default = Template.bind({});
Default.args = {
  loading: false,
  label: 'US Dollars',
  help: 'Us dollars',
  currency: 'usd',
  ad_hoc: true,
  ad_hoc_min_amount: 100,
  ad_hoc_max_amount: 10000,
};

export const Euros = Template.bind({});
Euros.args = {
  loading: false,
  currency: 'eur',
  label: 'Euros',
  help: 'EU Euros',
  ad_hoc: true,
  ad_hoc_min_amount: 100,
  ad_hoc_max_amount: 10000,
};

export const Loading = Template.bind({});
Loading.args = {
  loading: true,
  currency: 'eur',
  ad_hoc: true,
  ad_hoc_min_amount: 100,
  ad_hoc_max_amount: 10000,
};
