# ce-form-components-validator



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute  | Description | Type      | Default     |
| ---------- | ---------- | ----------- | --------- | ----------- |
| `disabled` | `disabled` |             | `boolean` | `undefined` |
| `order`    | --         | The order   | `Order`   | `undefined` |


## Dependencies

### Used by

 - [ce-checkout](../../controllers/checkout-form/checkout)

### Depends on

- [ce-order-shipping-address](../../controllers/checkout-form/order-shipping-address)

### Graph
```mermaid
graph TD;
  ce-form-components-validator --> ce-order-shipping-address
  ce-order-shipping-address --> ce-address
  ce-address --> ce-form-control
  ce-address --> ce-select
  ce-address --> ce-input
  ce-form-control --> ce-tooltip
  ce-select --> ce-menu-label
  ce-select --> ce-menu-item
  ce-select --> ce-form-control
  ce-select --> ce-dropdown
  ce-select --> ce-icon
  ce-select --> ce-input
  ce-select --> ce-spinner
  ce-select --> ce-menu
  ce-input --> ce-form-control
  ce-checkout --> ce-form-components-validator
  style ce-form-components-validator fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
