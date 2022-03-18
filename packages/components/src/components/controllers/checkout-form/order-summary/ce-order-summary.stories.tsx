export default {
  title: 'Components/OrderSummary',
};

const Template = ({ loading, collapsible, collapsed, order }) => {
  setTimeout(() => {
    document.querySelector('ce-order-summary').order = order;
  });
  return `<ce-order-summary ${loading && 'loading'} ${collapsible && 'collapsible'} ${collapsed && 'collapsed'}>
  <ce-line-items></ce-line-items>
  </ce-order-summary>`;
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
