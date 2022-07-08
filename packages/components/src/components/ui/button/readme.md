# ce-button

<!-- Auto Generated Below -->


## Properties

| Property   | Attribute  | Description                                                                                            | Type                                                                                         | Default     |
| ---------- | ---------- | ------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- | ----------- |
| `busy`     | `busy`     | Draws the button in a busy state.                                                                      | `boolean`                                                                                    | `false`     |
| `caret`    | `caret`    | Draws the button with a caret for use with dropdowns, popovers, etc.                                   | `boolean`                                                                                    | `false`     |
| `circle`   | `circle`   | Draws a circle button.                                                                                 | `boolean`                                                                                    | `false`     |
| `disabled` | `disabled` | Disables the button.                                                                                   | `boolean`                                                                                    | `false`     |
| `download` | `download` | Tells the browser to download the linked file as this filename. Only used when `href` is set.          | `string`                                                                                     | `undefined` |
| `full`     | `full`     | Draws the button full-width.                                                                           | `boolean`                                                                                    | `false`     |
| `href`     | `href`     | When set, the underlying button will be rendered as an `<a>` with this `href` instead of a `<button>`. | `string`                                                                                     | `undefined` |
| `loading`  | `loading`  | Draws the button in a loading state.                                                                   | `boolean`                                                                                    | `false`     |
| `name`     | `name`     | An optional name for the button. Ignored when `href` is set.                                           | `string`                                                                                     | `undefined` |
| `outline`  | `outline`  | Draws an outlined button.                                                                              | `boolean`                                                                                    | `false`     |
| `pill`     | `pill`     | Draws a pill-style button with rounded edges.                                                          | `boolean`                                                                                    | `false`     |
| `size`     | `size`     | The button's size.                                                                                     | `"large" \| "medium" \| "small"`                                                             | `'medium'`  |
| `submit`   | `submit`   | Indicates if activating the button should submit the form. Ignored when `href` is set.                 | `boolean`                                                                                    | `false`     |
| `target`   | `target`   | Tells the browser where to open the link. Only used when `href` is set.                                | `"_blank" \| "_parent" \| "_self" \| "_top"`                                                 | `undefined` |
| `type`     | `type`     | The button's type.                                                                                     | `"danger" \| "default" \| "info" \| "link" \| "primary" \| "success" \| "text" \| "warning"` | `'default'` |
| `value`    | `value`    | An optional value for the button. Ignored when `href` is set.                                          | `string`                                                                                     | `undefined` |


## Events

| Event     | Description                          | Type                |
| --------- | ------------------------------------ | ------------------- |
| `scBlur`  | Emitted when the button loses focus. | `CustomEvent<void>` |
| `scFocus` | Emitted when the button gains focus. | `CustomEvent<void>` |


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

 - [sc-cart-submit](../../controllers/cart/cart-submit)
 - [sc-charges-list](../../controllers/dashboard/charges-list)
 - [sc-coupon-form](../coupon-form)
 - [sc-customer-details](../customer-details)
 - [sc-customer-edit](../../controllers/dashboard/customer-edit)
 - [sc-dialog](../sc-dialog)
 - [sc-donation-choices](../../controllers/checkout-form/donation-choices)
 - [sc-downloads-list](../downloads-list)
 - [sc-invoices-list](../../controllers/dashboard/invoices-list)
 - [sc-login-form](../../controllers/login)
 - [sc-order-submit](../../controllers/checkout-form/order-submit)
 - [sc-orders-list](../../controllers/dashboard/orders-list)
 - [sc-pagination](../pagination)
 - [sc-payment-method-create](../../controllers/dashboard/payment-method-create)
 - [sc-payment-methods-list](../../controllers/dashboard/payment-methods-list)
 - [sc-subscription](../../controllers/dashboard/subscription)
 - [sc-subscription-ad-hoc-confirm](../../controllers/dashboard/subscription-ad-hoc-confirm)
 - [sc-subscription-cancel](../../controllers/dashboard/subscription-cancel)
 - [sc-subscription-payment](../../controllers/dashboard/subscription-payment)
 - [sc-subscription-renew](../../controllers/dashboard/subscription-renew)
 - [sc-subscription-switch](../../controllers/dashboard/subscription-switch)
 - [sc-subscriptions-list](../../controllers/dashboard/subscriptions-list)
 - [sc-tax-id-input](../tax-id-input)
 - [sc-upcoming-invoice](../../controllers/dashboard/upcoming-invoice)
 - [sc-wordpress-password-edit](../../controllers/dashboard/wordpress-password-edit)
 - [sc-wordpress-user](../../controllers/dashboard/wordpress-user)
 - [sc-wordpress-user-edit](../../controllers/dashboard/wordpress-user-edit)

### Depends on

- [sc-spinner](../spinner)

### Graph
```mermaid
graph TD;
  sc-button --> sc-spinner
  sc-cart-submit --> sc-button
  sc-charges-list --> sc-button
  sc-coupon-form --> sc-button
  sc-customer-details --> sc-button
  sc-customer-edit --> sc-button
  sc-dialog --> sc-button
  sc-donation-choices --> sc-button
  sc-downloads-list --> sc-button
  sc-invoices-list --> sc-button
  sc-login-form --> sc-button
  sc-order-submit --> sc-button
  sc-orders-list --> sc-button
  sc-pagination --> sc-button
  sc-payment-method-create --> sc-button
  sc-payment-methods-list --> sc-button
  sc-subscription --> sc-button
  sc-subscription-ad-hoc-confirm --> sc-button
  sc-subscription-cancel --> sc-button
  sc-subscription-payment --> sc-button
  sc-subscription-renew --> sc-button
  sc-subscription-switch --> sc-button
  sc-subscriptions-list --> sc-button
  sc-tax-id-input --> sc-button
  sc-upcoming-invoice --> sc-button
  sc-wordpress-password-edit --> sc-button
  sc-wordpress-user --> sc-button
  sc-wordpress-user-edit --> sc-button
  style sc-button fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
