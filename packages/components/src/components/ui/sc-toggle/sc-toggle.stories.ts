export default {
  title: 'Components/Toggle',
};

const DefaultTemplate = ({ collapsible }) => /*html*/ `
  <sc-toggles collapsible="${collapsible ? 'true' : 'false'}" style="--toggle-spacing: 3px">
    <sc-toggle>
      <span slot="summary">Summary Slot</span>
      This is text
    </sc-toggle>
    <sc-toggle summary="Summary Prop">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
    aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
    </sc-toggle>
    <sc-toggle>
      <span slot="summary">PayPal</span>
      This is text
    </sc-toggle>
   </sc-toggles>`;

export const Default = DefaultTemplate.bind({});
Default.args = {
  collapsible: false,
};

const ContainerTemplate = ({ collapsible, showControl }) => /*html*/ `
<sc-toggles collapsible="${collapsible ? 'true' : 'false'}" theme="container">
    <sc-toggle show-control="${showControl}">
      <span slot="summary">Summary Slot</span>
      This is text
    </sc-toggle>
    <sc-toggle summary="Summary Prop" show-control="${showControl}">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
    aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
    </sc-toggle>
    <sc-toggle show-control="${showControl}">
      <span slot="summary">PayPal</span>
      This is text
    </sc-toggle>
   </sc-toggles>`;

export const Container = ContainerTemplate.bind({});
Container.args = {
  collapsible: false,
  showControl: true,
};
