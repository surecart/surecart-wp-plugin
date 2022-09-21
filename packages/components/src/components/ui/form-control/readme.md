# ce-form-control

<!-- Auto Generated Below -->


## Properties

| Property       | Attribute       | Description                                     | Type                             | Default     |
| -------------- | --------------- | ----------------------------------------------- | -------------------------------- | ----------- |
| `errorMessage` | `error-message` | Store the error message                         | `string`                         | `undefined` |
| `errors`       | `errors`        | Display server-side validation errors.          | `any`                            | `undefined` |
| `help`         | `help`          | Help text                                       | `string`                         | `undefined` |
| `helpId`       | `help-id`       | Help id                                         | `string`                         | `undefined` |
| `inputId`      | `input-id`      | Input id.                                       | `string`                         | `undefined` |
| `label`        | `label`         | Input label.                                    | `string`                         | `undefined` |
| `labelId`      | `label-id`      | Input label id.                                 | `string`                         | `undefined` |
| `name`         | `name`          | Name for the input. Used for validation errors. | `string`                         | `undefined` |
| `required`     | `required`      | Whether the input is required.                  | `boolean`                        | `false`     |
| `showLabel`    | `show-label`    | Show the label.                                 | `boolean`                        | `true`      |
| `size`         | `size`          | Size of the label                               | `"large" \| "medium" \| "small"` | `'medium'`  |


## Shadow Parts

| Part             | Description |
| ---------------- | ----------- |
| `"form-control"` |             |
| `"help-text"`    |             |
| `"label"`        |             |


## Dependencies

### Used by

 - [sc-address](../address)
 - [sc-choices](../choices)
 - [sc-compact-address](../sc-compact-address)
 - [sc-input](../input)
 - [sc-order-bumps](../../controllers/checkout-form/sc-order-bumps)
 - [sc-payment](../../controllers/checkout-form/payment)
 - [sc-select](../select)
 - [sc-textarea](../sc-textarea)

### Depends on

- [sc-tooltip](../tooltip)

### Graph
```mermaid
graph TD;
  sc-form-control --> sc-tooltip
  sc-address --> sc-form-control
  sc-choices --> sc-form-control
  sc-compact-address --> sc-form-control
  sc-input --> sc-form-control
  sc-order-bumps --> sc-form-control
  sc-payment --> sc-form-control
  sc-select --> sc-form-control
  sc-textarea --> sc-form-control
  style sc-form-control fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
