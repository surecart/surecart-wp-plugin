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
  `<ce-choices>
  <ce-choice>test</ce-choice>
  <ce-choice>test</ce-choice>
  <ce-choice>test</ce-choice>
    </ce-choices>
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
  `<ce-choices style="--columns: ${columns}">
    <div>
  <ce-choice>
  This is a Title
  <span slot="description">This is a description</span>
  <span slot="price">Test</span>
  <span slot="per">/ Month</span>
  </ce-choice>
  <ce-choice>
  This is a Title
  <span slot="description">This is a description</span>
  <span slot="price">Test</span>
  <span slot="per">/ Month</span>
  </ce-choice>
  <ce-choice>
  This is a Title
  <span slot="description">This is a description</span>
  <span slot="price">Test</span>
  <span slot="per">/ Month</span>
  </ce-choice>
  </div>
    </ce-choices>`;

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
  `<ce-choices label="Choose an amount" auto-width>
    <div>
  <ce-choice show-control="false" size="small">
  <ce-format-number type="currency" currency="usd" value="500" minimum-fraction-digits="0"></ce-format-number>
  </ce-choice>
  <ce-choice show-control="false" size="small">
  <ce-format-number type="currency" currency="usd" value="1000" minimum-fraction-digits="0"></ce-format-number>
  </ce-choice>
  <ce-choice show-control="false" size="small">
  <ce-format-number type="currency" currency="usd" value="2000" minimum-fraction-digits="0"></ce-format-number>
  </ce-choice>
  </div>
    </ce-choices>`;

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
