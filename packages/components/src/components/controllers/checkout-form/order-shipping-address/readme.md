# ce-order-shipping-address



<!-- Auto Generated Below -->


## Properties

| Property         | Attribute         | Description                                | Type      | Default     |
| ---------------- | ----------------- | ------------------------------------------ | --------- | ----------- |
| `defaultCountry` | `default-country` | Default country for address                | `string`  | `undefined` |
| `full`           | `full`            | Show the address                           | `boolean` | `undefined` |
| `label`          | `label`           | Label for the field.                       | `string`  | `undefined` |
| `requireName`    | `require-name`    | Whether to require the name in the address | `boolean` | `false`     |
| `required`       | `required`        | Is this required (defaults to false)       | `boolean` | `false`     |
| `showLine2`      | `show-line-2`     | Show the line 2 field.                     | `boolean` | `undefined` |
| `showName`       | `show-name`       | Show the name field.                       | `boolean` | `undefined` |


## Methods

### `reportValidity() => Promise<boolean>`



#### Returns

Type: `Promise<boolean>`




## Dependencies

### Used by

 - [sc-form-components-validator](../../../providers/form-components-validator)

### Depends on

- [sc-address](../../../ui/address)
- [sc-compact-address](../../../ui/sc-compact-address)

### Graph
```mermaid
graph TD;
  sc-order-shipping-address --> sc-address
  sc-order-shipping-address --> sc-compact-address
  sc-address --> sc-form-control
  sc-address --> sc-select
  sc-address --> sc-input
  sc-address --> sc-block-ui
  sc-form-control --> sc-visually-hidden
  sc-select --> sc-icon
  sc-select --> sc-menu-label
  sc-select --> sc-menu-item
  sc-select --> sc-form-control
  sc-select --> sc-dropdown
  sc-select --> sc-input
  sc-select --> sc-spinner
  sc-select --> sc-menu
  sc-input --> sc-form-control
  sc-block-ui --> sc-spinner
  sc-compact-address --> sc-form-control
  sc-compact-address --> sc-select
  sc-compact-address --> sc-input
  sc-compact-address --> sc-block-ui
  sc-form-components-validator --> sc-order-shipping-address
  style sc-order-shipping-address fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
