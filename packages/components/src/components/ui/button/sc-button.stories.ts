export default {
  title: 'Components/Button',
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
  `<sc-button
  type="${args.type}"
  size="${args.size}"
  ${args.caret && 'caret'}
  ${args.loading && 'loading'}
  ${args.full && 'full'}
  ${args.disabled && 'disabled'}
  ${args.outline && 'outline'}
  ${args.pill && 'pill'}
  ${args.circle && 'circle'}
   data-testid="button">Click me</sc-button>`;

export const Button = Template.bind({});
Button.args = {
  type: 'primary',
  size: 'medium',
  loading: false,
  caret: false,
  full: false,
  disabled: false,
  outline: false,
  pill: false,
  circle: false,
};
