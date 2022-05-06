# ce-checkout



<!-- Auto Generated Below -->


## Properties

| Property                      | Attribute                       | Description                                 | Type                           | Default     |
| ----------------------------- | ------------------------------- | ------------------------------------------- | ------------------------------ | ----------- |
| `alignment`                   | `alignment`                     | Alignment                                   | `"center" \| "full" \| "wide"` | `undefined` |
| `coupon`                      | --                              | Optionally pass a coupon.                   | `Coupon`                       | `undefined` |
| `currencyCode`                | `currency-code`                 | Currency to use for this checkout.          | `string`                       | `'usd'`     |
| `customer`                    | --                              | Stores the current customer                 | `Customer`                     | `undefined` |
| `disableComponentsValidation` | `disable-components-validation` | Should we disable components validation     | `boolean`                      | `undefined` |
| `editLineItems`               | `edit-line-items`               | Can we edit line items?                     | `boolean`                      | `true`      |
| `formId`                      | `form-id`                       | The checkout form id                        | `number`                       | `undefined` |
| `loggedIn`                    | `logged-in`                     | Is this user logged in?                     | `boolean`                      | `undefined` |
| `mode`                        | `mode`                          | Are we in test or live mode.                | `"live" \| "test"`             | `'live'`    |
| `modified`                    | `modified`                      | When the form was modified.                 | `string`                       | `undefined` |
| `persistSession`              | `persist-session`               | Where to go on success                      | `boolean`                      | `true`      |
| `prices`                      | --                              | An array of prices to pre-fill in the form. | `PriceChoice[]`                | `[]`        |
| `processors`                  | --                              | Processors enabled for this form.           | `Processor[]`                  | `undefined` |
| `removeLineItems`             | `remove-line-items`             | Can we remove line items?                   | `boolean`                      | `true`      |
| `successUrl`                  | `success-url`                   | Where to go on success                      | `string`                       | `''`        |


## Events

| Event              | Description               | Type                         |
| ------------------ | ------------------------- | ---------------------------- |
| `scOrderError`     | Order has an error.       | `CustomEvent<ResponseError>` |
| `scOrderFinalized` | Order has been finalized. | `CustomEvent<Order>`         |
| `scOrderUpdated`   | Order has been updated.   | `CustomEvent<Order>`         |


## Methods

### `submit({ skip_validation }?: { skip_validation: boolean; }) => Promise<Order | CustomEvent<string>>`

Submit the form

#### Returns

Type: `Promise<Order | CustomEvent<string>>`



### `validate() => Promise<boolean>`



#### Returns

Type: `Promise<boolean>`




## Dependencies

### Depends on

- [sc-alert](../../../ui/alert)
- [sc-block-ui](../../../ui/block-ui)
- [sc-form-components-validator](../../../providers/form-components-validator)
- [sc-session-provider](../../../providers/session-provider)

### Graph
```mermaid
graph TD;
  sc-checkout --> sc-alert
  sc-checkout --> sc-block-ui
  sc-checkout --> sc-form-components-validator
  sc-checkout --> sc-session-provider
  sc-alert --> sc-icon
  sc-block-ui --> sc-spinner
  sc-form-components-validator --> sc-order-shipping-address
  sc-order-shipping-address --> sc-address
  sc-address --> sc-form-control
  sc-address --> sc-select
  sc-address --> sc-input
  sc-form-control --> sc-tooltip
  sc-select --> sc-menu-label
  sc-select --> sc-menu-item
  sc-select --> sc-form-control
  sc-select --> sc-dropdown
  sc-select --> sc-icon
  sc-select --> sc-input
  sc-select --> sc-spinner
  sc-select --> sc-menu
  sc-input --> sc-form-control
  sc-session-provider --> sc-line-items-provider
  style sc-checkout fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
