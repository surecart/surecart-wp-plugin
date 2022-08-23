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
    <sc-alert type="primary" open><span slot="title">Something went wrong.</span><ul><li>Test1</li><li>Test2</li></ul></sc-alert>
    <sc-alert type="success" open><span slot="title">Something went wrong.</span><ul><li>Test1</li><li>Test2</li></ul></sc-alert>
    <sc-alert type="info" open><span slot="title">Something went wrong.</span><ul><li>Test1</li><li>Test2</li></ul></sc-alert>
    <sc-alert type="warning" open><span slot="title">Something went wrong.</span><ul><li>Test1</li><li>Test2</li></ul></sc-alert>
    <sc-alert type="danger" open><span slot="title">Something went wrong.</span><ul><li>Test1</li><li>Test2</li></ul></sc-alert>

    <sc-badge-notice>SC Badge Alert</sc-badge-notice>
    <sc-checkbox>SC Checkbox</sc-checkbox>
    <sc-choice>SC Choice</sc-choice>
    <sc-choices label="SC Shoices">
      <sc-choice>SC Choice-1</sc-choice>
      <sc-choice>SC Choice-2</sc-choice>
    </sc-choices>
    <sc-column>SC Column</sc-column>
    <sc-columns>
      <sc-column>SC Column1</sc-column>
      <sc-column>SC Column2</sc-column>
      <sc-column>SC Column3</sc-column>
    </sc-columns>

    <sc-customer-details>SC Customer Details</sc-customer-details>
    <sc-dashboard-module>SC Dashboard Module</sc-dashboard-module>

    <sc-divider>SC Divider</sc-divider>
    <sc-downloads-list>SC Downloads List</sc-downloads-list>
    <dropdown position="bottom-right">
      <sc-button type="text" slot="trigger" circle>
        <sc-icon name="more-horizontal" />
      </sc-button>
      <sc-menu>
        <sc-menu-item>Start Plan</sc-menu-item>
      </sc-menu>
    </dropdown>


    <sc-menu-label>SC Menu Lable</sc-menu-label>
    <sc-order-status-badge>SC Order Status Badge</sc-order-status-badge>
    <sc-pagination>SC Pagination</sc-pagination>
    <paypal-buttons>Paypal Buttons</paypal-buttons>
    <sc-price-input>SC Price Input</sc-price-input>
    <sc-product-line-item>SC product-line-item</sc-product-line-item>
    <sc-quantity-select>SC Price Input</sc-quantity-select>
    <sc-radio>SC Radio</sc-radio>
    <sc-radio-group label="SC Radio">
      <sc-radio>SC Radio1</sc-radio>
      <sc-radio>SC Radio2</sc-radio>
    </sc-radio-group>
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
    <sc-tag-group>
      <sc-tag-panel>SC tag-panel</sc-tag-panel>
      <sc-tab>SC tab1</sc-tab>
      <sc-tab>SC tab2</sc-tab>
      <sc-tab>SC tab3</sc-tab>
    </sc-tag-group>

    <sc-table>
      <sc-table-cell slot="head">Number</sc-table-cell>
      <sc-table-cell slot="head">Items</sc-table-cell>
      <sc-table-cell slot="head">Total</sc-table-cell>
      <sc-table-cell slot="head" style="width: '100px'">Status</sc-table-cell>
      <sc-table-cell slot="head" style="width: '100px'"></sc-table-cell>
      <sc-table-row>
        <sc-table-cell>
          <sc-text truncate>
            15AG68LR
          </sc-text>
        </sc-table-cell>
        <sc-table-cell>
          <sc-text
            truncate
          >
          items
          </sc-text>
        </sc-table-cell>
        <sc-table-cell>
          <sc-format-number
            type="currency"
            currency="USD"
            value="2500"
          ></sc-format-number>
        </sc-table-cell>
        <sc-table-cell>
          <sc-order-status-badge status="paid"></sc-order-status-badge>
        </sc-table-cell>
        <sc-table-cell>
          <sc-button size="small">View</sc-button>
        </sc-table-cell>
      </sc-table-row>
      <sc-table-row>
        <sc-table-cell>
          <sc-text truncate>
            15AG68LR
          </sc-text>
        </sc-table-cell>
        <sc-table-cell>
          <sc-text
            truncate
          >
          items
          </sc-text>
        </sc-table-cell>
        <sc-table-cell>
          <sc-format-number
            type="currency"
            currency="USD"
            value="2500"
          ></sc-format-number>
        </sc-table-cell>
        <sc-table-cell>
          <sc-order-status-badge status="paid"></sc-order-status-badge>
        </sc-table-cell>
        <sc-table-cell>
          <sc-button size="small">View</sc-button>
        </sc-table-cell>
      </sc-table-row>
    </sc-table>


    <sc-tag>SC tag</sc-tag>
    <sc-skeleton>SC skeleton</sc-skeleton>
    <sc-tax-id-input>SC tax-id-input</sc-tax-id-input>
    <sc-text>SC text</sc-text>
    <sc-tooltip>SC tooltip</sc-tooltip>

    <sc-empty icon="shopping-bag">SC Empty</sc-empty>
    <sc-empty icon="inbox">SC Empty</sc-empty>
    <sc-error>SC Error</sc-error>
    <sc-form-control>SC Form</sc-form-control>
    <sc-form-row>SC Form Row</sc-form-row>
    <sc-heading>SC Heading</sc-heading>
    <sc-menu-label>SC Menu Lable</sc-menu-label>
    <sc-order-status-badge>SC Order Status Badge</sc-order-status-badge>
  </sc-form>
</div>`;
};

export const Dark = Template.bind({});
Dark.args = {
  theme: 'dark',
};
