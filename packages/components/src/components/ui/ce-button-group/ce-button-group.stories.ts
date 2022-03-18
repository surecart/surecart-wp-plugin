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
  `<ce-button-group ${args.separate && 'separate'}><ce-button
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
   <ce-format-number type="currency" currency="usd" value="2000"></ce-format-number></ce-button> <ce-button
   type="${args.type}"
   size="${args.size}"
   ${args.caret && 'caret'}
   ${args.loading && 'loading'}
   ${args.full && 'full'}
   ${args.disabled && 'disabled'}
   ${args.outline && 'outline'}
   ${args.pill && 'pill'}
   ${args.circle && 'circle'}
    data-testid="button">Click me</ce-button>
    </ce-button-group>`;

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
