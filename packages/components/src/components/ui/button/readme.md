# ce-button

<!-- Auto Generated Below -->


## Properties

| Property   | Attribute  | Description                                                                                            | Type                                                                               | Default     |
| ---------- | ---------- | ------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- | ----------- |
| `busy`     | `busy`     | Draws the button in a busy state.                                                                      | `boolean`                                                                          | `false`     |
| `caret`    | `caret`    | Draws the button with a caret for use with dropdowns, popovers, etc.                                   | `boolean`                                                                          | `false`     |
| `circle`   | `circle`   | Draws a circle button.                                                                                 | `boolean`                                                                          | `false`     |
| `disabled` | `disabled` | Disables the button.                                                                                   | `boolean`                                                                          | `false`     |
| `download` | `download` | Tells the browser to download the linked file as this filename. Only used when `href` is set.          | `string`                                                                           | `undefined` |
| `full`     | `full`     | Draws the button full-width.                                                                           | `boolean`                                                                          | `false`     |
| `href`     | `href`     | When set, the underlying button will be rendered as an `<a>` with this `href` instead of a `<button>`. | `string`                                                                           | `undefined` |
| `loading`  | `loading`  | Draws the button in a loading state.                                                                   | `boolean`                                                                          | `false`     |
| `name`     | `name`     | An optional name for the button. Ignored when `href` is set.                                           | `string`                                                                           | `undefined` |
| `outline`  | `outline`  | Draws an outlined button.                                                                              | `boolean`                                                                          | `false`     |
| `pill`     | `pill`     | Draws a pill-style button with rounded edges.                                                          | `boolean`                                                                          | `false`     |
| `size`     | `size`     | The button's size.                                                                                     | `"large" \| "medium" \| "small"`                                                   | `'medium'`  |
| `submit`   | `submit`   | Indicates if activating the button should submit the form. Ignored when `href` is set.                 | `boolean`                                                                          | `false`     |
| `target`   | `target`   | Tells the browser where to open the link. Only used when `href` is set.                                | `"_blank" \| "_parent" \| "_self" \| "_top"`                                       | `undefined` |
| `type`     | `type`     | The button's type.                                                                                     | `"danger" \| "default" \| "info" \| "primary" \| "success" \| "text" \| "warning"` | `'default'` |
| `value`    | `value`    | An optional value for the button. Ignored when `href` is set.                                          | `string`                                                                           | `undefined` |


## Events

| Event     | Description                          | Type                |
| --------- | ------------------------------------ | ------------------- |
| `ceBlur`  | Emitted when the button loses focus. | `CustomEvent<void>` |
| `ceFocus` | Emitted when the button gains focus. | `CustomEvent<void>` |


## Shadow Parts

| Part       | Description |
| ---------- | ----------- |
| `"base"`   |             |
| `"caret"`  |             |
| `"label"`  |             |
| `"prefix"` |             |
| `"suffix"` |             |


## Dependencies

### Used by

 - [ce-charges-list](../../controllers/dashboard/charges-list)
 - [ce-coupon-form](../../controllers/coupon-form)
 - [ce-customer-orders-list](../../controllers/dashboard/customer-orders-list)
 - [ce-customer-subscription-edit](../../controllers/dashboard/subscription-detail)
 - [ce-login-form](../../controllers/login)
 - [ce-orders-list](../../controllers/dashboard/orders-list)
 - [ce-payment-methods-list](../../controllers/dashboard/payment-methods-list)
 - [ce-subscription](../../controllers/dashboard/subscription)

### Depends on

- [ce-spinner](../spinner)

### Graph
```mermaid
graph TD;
  ce-button --> ce-spinner
  ce-charges-list --> ce-button
  ce-coupon-form --> ce-button
  ce-customer-orders-list --> ce-button
  ce-customer-subscription-edit --> ce-button
  ce-login-form --> ce-button
  ce-orders-list --> ce-button
  ce-payment-methods-list --> ce-button
  ce-subscription --> ce-button
  style ce-button fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
