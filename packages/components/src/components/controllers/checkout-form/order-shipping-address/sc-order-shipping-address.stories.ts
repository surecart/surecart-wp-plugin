export default {
  title: 'Components/Checkout/Order Shipping Address',
};

const Template = ({ loading, label }) => {
  // setTimeout(() => {
  //   const input = document.querySelector('sc-order-shipping-address');
  //   // input.price = {
  //   //   id: 'test',
  //   //   amount,
  //   //   currency,
  //   //   ad_hoc_max_amount,
  //   //   ad_hoc_min_amount,
  //   // } as any;
  // });

  return `<sc-order-shipping-address ${loading && 'loading'} label="${label}"></sc-order-shipping-address>`;
};

export const Default = Template.bind({});
Default.args = {
  loading: false,
  label: 'Address',
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
  label: 'Address',
};
