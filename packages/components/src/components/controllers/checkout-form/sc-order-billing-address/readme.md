# sc-order-billing-address



<!-- Auto Generated Below -->


## Properties

| Property                | Attribute                 | Description                 | Type      | Default                                                 |
| ----------------------- | ------------------------- | --------------------------- | --------- | ------------------------------------------------------- |
| `cityPlaceholder`       | `city-placeholder`        | City placeholder            | `string`  | `__('City', 'surecart')`                                |
| `countryPlaceholder`    | `country-placeholder`     | Country placeholder         | `string`  | `__('Country', 'surecart')`                             |
| `defaultCountry`        | `default-country`         | Default country for address | `string`  | `undefined`                                             |
| `label`                 | `label`                   | Label for the field         | `string`  | `undefined`                                             |
| `line1Placeholder`      | `line-1-placeholder`      | Address placeholder         | `string`  | `__('Address', 'surecart')`                             |
| `line2Placeholder`      | `line-2-placeholder`      | Address Line 2 placeholder  | `string`  | `__('Address Line 2', 'surecart')`                      |
| `namePlaceholder`       | `name-placeholder`        | Name placeholder            | `string`  | `__('Name or Company Name', 'surecart')`                |
| `postalCodePlaceholder` | `postal-code-placeholder` | Postal Code placeholder     | `string`  | `__('Postal Code/Zip', 'surecart')`                     |
| `showName`              | `show-name`               | Show the name field         | `boolean` | `undefined`                                             |
| `statePlaceholder`      | `state-placeholder`       | State placeholder           | `string`  | `__('State/Province/Region', 'surecart')`               |
| `toggleLabel`           | `toggle-label`            | Toggle label                | `string`  | `__('Billing address is same as shipping', 'surecart')` |


## Methods

### `reportValidity() => Promise<boolean>`



#### Returns

Type: `Promise<boolean>`




## Dependencies

### Used by

 - [sc-form-components-validator](../../../providers/form-components-validator)

### Depends on

- [sc-checkbox](../../../ui/checkbox)
- [sc-address](../../../ui/address)

### Graph
```mermaid
graph TD;
  sc-order-billing-address --> sc-checkbox
  sc-order-billing-address --> sc-address
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
  sc-form-components-validator --> sc-order-billing-address
  style sc-order-billing-address fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
