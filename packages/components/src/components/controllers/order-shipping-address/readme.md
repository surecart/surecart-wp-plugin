# ce-order-shipping-address



<!-- Auto Generated Below -->


## Properties

| Property                  | Attribute  | Description                           | Type      | Default     |
| ------------------------- | ---------- | ------------------------------------- | --------- | ----------- |
| `customerShippingAddress` | --         | Holds the customer's shipping address | `Address` | `undefined` |
| `label`                   | `label`    | Label for the field.                  | `string`  | `undefined` |
| `loading`                 | `loading`  | Is this loading.                      | `boolean` | `undefined` |
| `required`                | `required` | Is this required (defaults to true)   | `boolean` | `true`      |
| `shippingAddress`         | --         | Holds the customer's billing address  | `Address` | `undefined` |


## Dependencies

### Used by

 - [ce-form-components-validator](../../providers/form-components-validator)

### Depends on

- [ce-address](../../ui/address)

### Graph
```mermaid
graph TD;
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
  ce-form-components-validator --> ce-order-shipping-address
  style ce-order-shipping-address fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
