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
  
    <sc-address label="Test">SC Address</sc-address>
    <sc-alert type="primary"><span slot="title">Something went wrong.</span><ul><li>Test1</li><li>Test2</li></ul></sc-address>
    <sc-alert type="success"><span slot="title">Something went wrong.</span><ul><li>Test1</li><li>Test2</li></ul></sc-address>
    <sc-alert type="info"><span slot="title">Something went wrong.</span><ul><li>Test1</li><li>Test2</li></ul></sc-address>
    <sc-alert type="warning"><span slot="title">Something went wrong.</span><ul><li>Test1</li><li>Test2</li></ul></sc-address>
    <sc-alert type="danger"><span slot="title">Something went wrong.</span><ul><li>Test1</li><li>Test2</li></ul></sc-address>
    <sc-badge-notice>SC Badge Alert</sc-badge-notice>
    <sc-block-ui spinner>SC Block UI</sc-block-ui>
    <sc-breadcrumbs><sc-breadcrumb href="admin.php?page=sc-dashboard">SC Breadcrumb</sc-breadcrumb></sc-breadcrumbs>
    <sc-card>SC Card</sc-card>
    <sc-cc-logo>SC Logo</sc-cc-logo>
    <sc-checkbox>SC Checkbox</sc-checkbox>
    <sc-choice>SC Choice</sc-choice>
    <sc-choices>SC Choices</sc-choices>
    <sc-column>SC Column</sc-column>
    <sc-columns>SC Columns</sc-columns>
    <sc-coupon-form>SC Coupon Form</sc-coupon-form>
    <sc-customer-details>SC Customer Details</sc-customer-details>
    <sc-dashboard-module>SC Dashboard Module</sc-dashboard-module>
    <sc-divider>SC Divider</sc-divider>
    <sc-downloads-list>SC Downloads List</sc-downloads-list>
    <dropdown>SC Dropdown</dropdown>
    <sc-empty>SC Empty</sc-empty>
    <sc-error>SC Error</sc-error>
    <sc-flex>SC flex</sc-flex>
    <sc-form>SC Form</sc-form>
    <sc-form-control>SC Form</sc-form-control>
    <sc-form-row>SC Form Row</sc-form-row>
    <sc-heading>SC Heading</sc-heading>
    <sc-icon>SC Icon</sc-icon>
    <sc-input>SC Input</sc-input>
    <sc-line-item>SC Input</sc-line-item>
    <sc-menu>SC Menu</sc-menu>
    <sc-menu-divider>SC Menu Divider</sc-menu-divider>
    <sc-menu-item>SC Menu Item</sc-menu-item>
    <sc-menu-label>SC Menu Lable</sc-menu-label>
    <sc-order-status-badge>SC Order Status Badge</sc-order-status-badge>
    <sc-pagination>SC Pagination</sc-pagination>
    <paypal-buttons>Paypal Buttons</paypal-buttons>
    <sc-price-input>SC Price Input</sc-price-input>
    <sc-product-line-item>SC product-line-item</sc-product-line-item>
    <sc-quantity-select>SC Price Input</sc-quantity-select>
    <sc-radio>SC Radio</sc-radio>
    <sc-radio-group>SC Radio</sc-radio-group>
    <sc-button-group>SC Button Group</sc-group-group>
    <sc-cart-icon>SC Cart Icon</sc-cart-icon>
    <sc-compact-address>SC compact-address</sc-compact-address>
    <sc-dialog>SC dialog</sc-dialog>
    <sc-drawer>SC drawer</sc-drawer>
    <sc-textarea>SC textarea</sc-textarea>
    <sc-toggle>SC toggle</sc-toggle>
    <sc-toggles>SC toggles</sc-toggles>
    <sc-secure-notice>SC secure-notice</sc-secure-notice>
    <sc-select>SC select</sc-select>
    <sc-skeleton>SC skeleton</sc-skeleton>
    <sc-spacing>SC spacing</sc-spacing>
    <sc-spinner>SC spinner</sc-spinner>
    <sc-stacked-list>SC stacked-list</sc-stacked-list>
    <sc-stacked-list-row>SC stacked-list-row</sc-stacked-list-row>
    <sc-stripe-element>SC stripe-element</sc-stripe-element>
    <sc-stripe-payment-element>SC stripe payment element</sc-stripe-payment-element>
    <sc-stripe-payment-request>SC stripe-payment-request</sc-stripe-payment-request>
    <sc-subscription-status-badge>SC subscription-status-badge</sc-subscription-status-badge>
    <sc-switch>SC switch</sc-switch>
    <sc-tab>SC tab</sc-tab>
    <sc-tag-group>SC tag-group</sc-tag-group>
    <sc-tag-panel>SC tag-panel</sc-tag-panel>
    <sc-table>SC table</sc-table>
    <sc-table-cell>SC table-cell</sc-table-cell>
    <sc-table-head>SC table-head</sc-table-head>
    <sc-table-row>SC table-row</sc-table-row>
    <sc-tag>SC tag</sc-tag>
    <sc-skeleton>SC skeleton</sc-skeleton>
    <sc-tax-id-input>SC tax-id-input</sc-tax-id-input>
    <sc-text>SC text</sc-text>
    <sc-tooltip>SC tooltip</sc-tooltip>
  </sc-form>
</div>`;
};

export const Dark = Template.bind({});
Dark.args = {
  theme: 'dark',
};
