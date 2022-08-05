export default {
  title: 'Components/Themes',
  argTypes: {
    theme: {
      control: {
        type: 'select',
      },
      options: ['dark', 'light'],
    },
  },
};

const Template = ({ theme }) => {
  localStorage.clear();
  return `<div data-theme="${theme}" style="${theme === 'dark' && 'background: var(--sc-color-gray-900);'} height: 100%; padding: 40px;">
  <sc-form>
    <sc-input label="Test" help="Help text" placeholder="placeholder"><span slot="prefix">Prefix</span><span slot="suffix">Suffix</span></sc-input>
    <sc-input label="Test" help="Help text" value="test" placeholder="placeholder" clearable name="name" type="text"><span slot="prefix">Prefix</span><span slot="suffix">Suffix</span></sc-input>
    <sc-flex justify-content="flex-start">
      <sc-button>Button</sc-button>
      <sc-button type="primary">Button</sc-button>
      <sc-button type="success">Button</sc-button>
      <sc-button type="info">Button</sc-button>
      <sc-button type="warning">Button</sc-button>
      <sc-button type="danger">Button</sc-button>

      <sc-button outline>Button</sc-button>
      <sc-button type="primary" outline>Button</sc-button>
      <sc-button type="success" outline>Button</sc-button>
      <sc-button type="info" outline>Button</sc-button>
      <sc-button type="warning" outline>Button</sc-button>
      <sc-button type="danger" outline>Button</sc-button>

      <sc-button type="text">Button</sc-button>
      <sc-button type="link">Button</sc-button>
    </sc-flex>
  </sc-form>
</div>`;
};

export const Dark = Template.bind({});
Dark.args = {
  theme: 'dark',
};
