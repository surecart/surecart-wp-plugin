export default {
  title: 'Components/ButtonGroup',
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
  `<sc-button-group ${args.separate && 'separate'}><sc-button
  type="${args.type}"
  size="${args.size}"
  ${args.caret && 'caret'}
  ${args.loading && 'loading'}
  ${args.full && 'full'}
  ${args.disabled && 'disabled'}
  ${args.outline && 'outline'}
  ${args.pill && 'pill'}
  ${args.circle && 'circle'}
   data-testid="button">
   <sc-format-number type="currency" currency="usd" value="2000"></sc-format-number></sc-button> <sc-button
   type="${args.type}"
   size="${args.size}"
   ${args.caret && 'caret'}
   ${args.loading && 'loading'}
   ${args.full && 'full'}
   ${args.disabled && 'disabled'}
   ${args.outline && 'outline'}
   ${args.pill && 'pill'}
   ${args.circle && 'circle'}
    data-testid="button">Click me</sc-button>
    </sc-button-group>`;

export const Button = Template.bind({});
Button.args = {
  separate: true,
  type: 'default',
  size: 'medium',
  loading: false,
  caret: false,
  full: false,
  disabled: false,
  outline: false,
  pill: false,
  circle: false,
};
