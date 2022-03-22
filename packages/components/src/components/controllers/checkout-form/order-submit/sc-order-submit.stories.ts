export default {
  title: 'Components/Checkout/Submit',
  parameters: {
    actions: {
      handles: ['mouseover', 'click'],
    },
  },
  argTypes: {
    size: {
      control: {
        type: 'select',
      },
      options: ['small', 'medium', 'large'],
    },
    type: {
      control: {
        type: 'select',
      },
      options: ['default', 'primary', 'success', 'info', 'warning', 'danger', 'text', 'link'],
    },
  },
};

const Template = args =>
  `<sc-order-submit
  type="${args.type}"
  size="${args.size}"
  ${args.loading && 'loading'}
  ${args.busy && 'busy'}
  ${args.paying && 'paying'}
  ${args.full && 'full'}
  icon="${args.icon}"
   data-testid="button">Submit Order</sc-button>`;

export const Button = Template.bind({});
Button.args = {
  type: 'primary',
  size: 'medium',
  loading: false,
  busy: false,
  paying: false,
  full: false,
  icon: 'lock',
};
