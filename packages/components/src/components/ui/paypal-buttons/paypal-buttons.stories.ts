export default {
  title: 'Components/PayPal Buttons',
};

const Template = ({ client_id }) => `<sc-paypal-buttons client-id="${client_id} "></sc-paypal-buttons>`;

export const Default = Template.bind({});
Default.args = {
  client_id: 'test',
};
