export default {
  title: 'Components/OrderSummary',
};

const Template = ({ loading, collapsible, collapsed, order }) => {
  setTimeout(() => {
    document.querySelector('sc-order-summary').order = order;
  });
  return `<sc-order-summary ${loading && 'loading'} ${collapsible && 'collapsible'} ${collapsed && 'collapsed'}>
  <sc-line-items></sc-line-items>
  </sc-order-summary>`;
};

export const Default = Template.bind({});
Default.args = {
  loading: false,
  collapsible: true,
  collapsed: false,
  order: {
    currency: 'USD',
    total_amount: 2200,
    line_items: {
      data: [
        {
          id: '1',
        },
      ],
    },
  },
};
