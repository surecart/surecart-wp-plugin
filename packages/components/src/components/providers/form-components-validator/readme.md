# ce-form-components-validator



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute  | Description         | Type          | Default     |
| ------------- | ---------- | ------------------- | ------------- | ----------- |
| `disabled`    | `disabled` | Disable validation? | `boolean`     | `undefined` |
| `order`       | --         | The order           | `Checkout`    | `undefined` |
| `taxProtocol` | --         | The tax protocol    | `TaxProtocol` | `undefined` |


## Dependencies

### Used by

 - [sc-checkout](../../controllers/checkout-form/checkout)

### Depends on

- [sc-order-shipping-address](../../controllers/checkout-form/order-shipping-address)
- [sc-order-tax-id-input](../../controllers/checkout-form/order-tax-id-input)
- [sc-order-bumps](../../controllers/checkout-form/sc-order-bumps)

### Graph
```mermaid
graph TD;
  sc-form-components-validator --> sc-order-shipping-address
  sc-form-components-validator --> sc-order-tax-id-input
  sc-form-components-validator --> sc-order-bumps
  sc-order-shipping-address --> sc-address
  sc-order-shipping-address --> sc-compact-address
  sc-address --> sc-form-control
  sc-address --> sc-input
  sc-address --> sc-select
  sc-address --> sc-block-ui
  sc-form-control --> sc-tooltip
  sc-input --> sc-form-control
  sc-select --> sc-icon
  sc-select --> sc-menu-label
  sc-select --> sc-menu-item
  sc-select --> sc-form-control
  sc-select --> sc-dropdown
  sc-select --> sc-input
  sc-select --> sc-spinner
  sc-select --> sc-menu
  sc-block-ui --> sc-spinner
  sc-compact-address --> sc-form-control
  sc-compact-address --> sc-select
  sc-compact-address --> sc-input
  sc-compact-address --> sc-block-ui
  sc-order-tax-id-input --> sc-tax-id-input
  sc-tax-id-input --> sc-icon
  sc-tax-id-input --> sc-input
  sc-tax-id-input --> sc-spinner
  sc-tax-id-input --> sc-dropdown
  sc-tax-id-input --> sc-button
  sc-tax-id-input --> sc-menu
  sc-tax-id-input --> sc-menu-item
  sc-button --> sc-spinner
  sc-order-bumps --> sc-form-control
  sc-order-bumps --> sc-order-bump
  sc-order-bump --> sc-format-number
  sc-order-bump --> sc-choice
  sc-order-bump --> sc-divider
  sc-checkout --> sc-form-components-validator
  style sc-form-components-validator fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
