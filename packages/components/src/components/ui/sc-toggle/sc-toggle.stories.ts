export default {
  title: 'Components/Toggle',
};

const Template = () => /*html*/ `<sc-card no-padding>
  <sc-toggles collapsible="false">
    <sc-toggle borderless style="border-bottom: 1px solid var(--sc-color-gray-200)">
      <span slot="summary">Summary Slot</span>
      This is text
    </sc-toggle>
    <sc-toggle borderless summary="Summary Prop" style="border-bottom: 1px solid var(--sc-color-gray-200)">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
    aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
    </sc-toggle>
    <sc-toggle borderless>
      <span slot="summary">PayPal</span>
      This is text
    </sc-toggle>
   </sc-toggles>
  </sc-card>`;

export const Default = Template.bind({});
Default.args = {};
