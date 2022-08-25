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
  setTimeout(() => {
    const select = document.querySelector('sc-select');
    select.choices = [
      {
        label: 'Test',
        value: 'test',
        choices: [
          {
            label: 'Test 2',
            value: 'test1',
          },
          {
            label: 'Test 1',
            value: 'test2',
          },
        ],
      },
    ];
    // input.price = {
    //   id: 'test',
    //   amount,
    //   currency,
    //   ad_hoc_max_amount,
    //   ad_hoc_min_amount,
    // } as any;
  });
  return `<div data-theme="${theme}" class="surecart-theme-${theme}" style="${theme === 'dark' && 'background: var(--sc-color-gray-950);'} height: 100%; padding: 40px;">
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

    <sc-flex justify-content="flex-start">
      <sc-tag>Tag</sc-tag>
      <sc-tag type="primary">Tag</sc-tag>
      <sc-tag type="success">Tag</sc-tag>
      <sc-tag type="info">Tag</sc-tag>
      <sc-tag type="warning">Tag</sc-tag>
      <sc-tag type="danger">Tag</sc-tag>
    </sc-flex>

    <sc-alert type="primary" open><span slot="title">Something went wrong.</span>This is a message</sc-alert>
    <sc-alert type="success" open><span slot="title">Something went wrong.</span>This is a message</sc-alert>
    <sc-alert type="info" open><span slot="title">Something went wrong.</span>This is a message</sc-alert>
    <sc-alert type="warning" open><span slot="title">Something went wrong.</span>This is a message</sc-alert>
    <sc-alert type="danger" open><span slot="title">Something went wrong.</span>This is a message</sc-alert>

    <sc-address label="Address"></sc-address>
    <sc-badge-notice label="test">SC Badge Alert</sc-badge-notice>

    <sc-card>Card</sc-card>

    <sc-radio-group label="Radio Group">
      <sc-radio>SC Radio1</sc-radio>
      <sc-radio checked>SC Radio2</sc-radio>
    </sc-radio-group>

    <sc-checkbox>Checkbox</sc-checkbox>

    <sc-switch>
      Switch
      <span slot="description">Description text</span>
    </sc-switch>

    <sc-choices label="SC Choices">
      <sc-choice>Choice</sc-choice>
      <sc-choice checked>Choice Checked</sc-choice>
      <sc-choice type="checkbox">Choice Checkbox</sc-choice>
      <sc-choice type="checkbox" checked>Choice Checked</sc-choice>
    </sc-choices>

    <sc-dashboard-module heading="Dashboard Module"></sc-dashboard-module>

    <sc-divider>SC Divider</sc-divider>

    <sc-menu style="max-width: 200px; border: solid 1px var(--sc-panel-border-color); border-radius: var(--sc-border-radius-medium);">
      <sc-menu-item>Option 1</sc-menu-item>
      <sc-menu-item>Option 2</sc-menu-item>
      <sc-menu-item>Option 3</sc-menu-item>
      <sc-menu-divider></sc-menu-divider>
      <sc-menu-item checked>Checked</sc-menu-item>
      <sc-menu-item disabled>Disabled</sc-menu-item>
      <sc-menu-divider></sc-menu-divider>
      <sc-menu-item>
      <span slot="prefix">A</span>Prefix
      </sc-menu-item>
      <sc-menu-item>
      Suffix <span slot="suffix">B</span>
      </sc-menu-item>
    </sc-menu>

    <sc-product-line-item amount="1000" currency="usd" interval="per month">
      <span slot="title">Product Title</span>
    </sc-product-line-item>

    <sc-textarea label="Text Area" placeholder="placeholder"></sc-textarea>
    <sc-textarea label="Text Area" value="This is some text"></sc-textarea>

    <sc-toggle summary="Toggle">Toggle content</sc-toggle>

    <sc-secure-notice>SC secure-notice</sc-secure-notice>

    <div style="margin-bottom: 200px">
    <sc-select label="Select" search open>SC select</sc-select>
    </div>

    <div>
      <header style="display: flex; align-items: center; margin-bottom: 1rem;">
        <sc-skeleton style="width: 3rem; height: 3rem; margin-right: 1rem; vertical-align: middle;"></sc-skeleton>
        <sc-skeleton style="width: 30%;"></sc-skeleton>
      </header>
      <sc-skeleton style="margin-bottom: 1rem;"></sc-skeleton>
      <sc-skeleton style="margin-bottom: 1rem; width: 95%;"></sc-skeleton>
      <sc-skeleton style="margin-bottom: 1rem; width: 80%;"></sc-skeleton>
    </div>

    <sc-spinner></sc-spinner>

    <sc-stacked-list> <sc-stacked-list-row>SC stacked-list-row</sc-stacked-list-row>
    <sc-stacked-list-row>SC stacked-list-row</sc-stacked-list-row>
    <sc-stacked-list-row>SC stacked-list-row</sc-stacked-list-row></sc-stacked-list>

    <sc-stripe-element label="Payment" publishable-key="pk_live_51KgGVf2E2Wr9trjmbUbolV7DGH5RkCjH08zkJbfPTyoE2EQfCj7WJGP5PgzJI3jH9eC15TgGa6URDwxK52Cp3tav00jQ4rwfyg" account-id="acct_1KgGVf2E2Wr9trjm"></sc-stripe-element>

    <sc-tab-group>
      <sc-tab slot="nav" panel="panel-1">SC tab1</sc-tab>
      <sc-tab slot="nav" panel="panel-2">SC tab2</sc-tab>
      <sc-tab slot="nav" panel="panel-3">SC tab3</sc-tab>
      <sc-tab-panel name="panel-1">SC tab-panel 1</sc-tab-panel>
      <sc-tab-panel name="panel-2">SC tab-panel 2</sc-tab-panel>
      <sc-tab-panel name="panel-3">SC tab-panel 3</sc-tab-panel>
    </sc-tab-group>

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

    <sc-heading>SC Heading</sc-heading>
    <sc-text>SC text</sc-text>
    <sc-empty icon="shopping-bag">SC Empty</sc-empty>
  </sc-form>
</div>`;
};

export const Dark = Template.bind({});
Dark.args = {
  theme: 'dark',
};
