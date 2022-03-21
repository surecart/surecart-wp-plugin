export default {
  title: 'Components/Choices',
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

const Template = () =>
  `<sc-choices>
  <sc-choice>test</sc-choice>
  <sc-choice>test</sc-choice>
  <sc-choice>test</sc-choice>
    </sc-choices>
`;

export const Default = Template.bind({});
Default.args = {
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

const ContainerTemplate = ({ columns }) =>
  `<sc-choices style="--columns: ${columns}">
    <div>
  <sc-choice>
  This is a Title
  <span slot="description">This is a description</span>
  <span slot="price">Test</span>
  <span slot="per">/ Month</span>
  </sc-choice>
  <sc-choice>
  This is a Title
  <span slot="description">This is a description</span>
  <span slot="price">Test</span>
  <span slot="per">/ Month</span>
  </sc-choice>
  <sc-choice>
  This is a Title
  <span slot="description">This is a description</span>
  <span slot="price">Test</span>
  <span slot="per">/ Month</span>
  </sc-choice>
  </div>
    </sc-choices>`;

export const Container = ContainerTemplate.bind({});
Container.args = {
  columns: 3,
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

const AutoWidthTemplate = () =>
  `<sc-choices label="Choose an amount" auto-width>
    <div>
  <sc-choice show-control="false" size="small">
  <sc-format-number type="currency" currency="usd" value="500" minimum-fraction-digits="0"></sc-format-number>
  </sc-choice>
  <sc-choice show-control="false" size="small">
  <sc-format-number type="currency" currency="usd" value="1000" minimum-fraction-digits="0"></sc-format-number>
  </sc-choice>
  <sc-choice show-control="false" size="small">
  <sc-format-number type="currency" currency="usd" value="2000" minimum-fraction-digits="0"></sc-format-number>
  </sc-choice>
  </div>
    </sc-choices>`;

export const AutoWidth = AutoWidthTemplate.bind({});
AutoWidth.args = {
  type: 'radio',
  size: 'medium',
  loading: false,
  caret: false,
  full: false,
  disabled: false,
  outline: false,
  pill: false,
  circle: false,
};
