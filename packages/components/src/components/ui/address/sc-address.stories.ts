export default {
  title: 'Components/Address',
};

const Template = args =>
  `<sc-address
  label="${args.label}"
  loading="${args.loading ? 'true' : 'false'}"
  required="${args.required ? 'true' : 'false'}"
></sc-address>`;

export const Default = Template.bind({});
Default.args = {
  label: 'Address',
  loading: false,
  required: false,
};
