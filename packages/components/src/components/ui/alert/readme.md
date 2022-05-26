# ce-alert



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute        | Description                                                                                                                                                                                                           | Type                                                        | Default     |
| -------------- | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- | ----------- |
| `closable`     | `closable`       | Makes the alert closable.                                                                                                                                                                                             | `boolean`                                                   | `false`     |
| `duration`     | `duration`       | The length of time, in milliseconds, the alert will show before closing itself. If the user interacts with the alert before it closes (e.g. moves the mouse over it), the timer will restart. Defaults to `Infinity`. | `number`                                                    | `Infinity`  |
| `open`         | `open`           | Indicates whether or not the alert is open. You can use this in lieu of the show/hide methods.                                                                                                                        | `boolean`                                                   | `false`     |
| `scrollMargin` | `scroll-margin`  | Scroll margin                                                                                                                                                                                                         | `string`                                                    | `'0px'`     |
| `scrollOnOpen` | `scroll-on-open` | Scroll into view.                                                                                                                                                                                                     | `boolean`                                                   | `undefined` |
| `type`         | `type`           | The type of alert.                                                                                                                                                                                                    | `"danger" \| "info" \| "primary" \| "success" \| "warning"` | `'primary'` |


## Events

| Event    | Description          | Type                |
| -------- | -------------------- | ------------------- |
| `scHide` | When alert is hidden | `CustomEvent<void>` |
| `scShow` | When alert is shown  | `CustomEvent<void>` |


## Methods

### `hide() => Promise<void>`

Hides the alert

#### Returns

Type: `Promise<void>`



### `show() => Promise<void>`

Shows the alert.

#### Returns

Type: `Promise<void>`




## Shadow Parts

| Part        | Description |
| ----------- | ----------- |
| `"base"`    |             |
| `"icon"`    |             |
| `"message"` |             |
| `"text"`    |             |
| `"title"`   |             |


## Dependencies

### Used by

 - [sc-checkout](../../controllers/checkout-form/checkout)
 - [sc-coupon-form](../coupon-form)
 - [sc-dashboard-module](../dashboard-module)
 - [sc-form-error-provider](../../providers/form-error-provider)
 - [sc-login-form](../../controllers/login)
 - [sc-payment](../../controllers/checkout-form/payment)
 - [sc-payment-method-create](../../controllers/dashboard/payment-method-create)
 - [sc-price-choice](../../controllers/checkout-form/price-choice)
 - [sc-stripe-payment-request](../stripe-payment-request)
 - [sc-subscription-cancel](../../controllers/dashboard/subscription-cancel)
 - [sc-subscription-renew](../../controllers/dashboard/subscription-renew)
 - [sc-upcoming-invoice](../../controllers/dashboard/upcoming-invoice)

### Depends on

- [sc-icon](../icon)

### Graph
```mermaid
graph TD;
  sc-alert --> sc-icon
  sc-checkout --> sc-alert
  sc-coupon-form --> sc-alert
  sc-dashboard-module --> sc-alert
  sc-form-error-provider --> sc-alert
  sc-login-form --> sc-alert
  sc-payment --> sc-alert
  sc-payment-method-create --> sc-alert
  sc-price-choice --> sc-alert
  sc-stripe-payment-request --> sc-alert
  sc-subscription-cancel --> sc-alert
  sc-subscription-renew --> sc-alert
  sc-upcoming-invoice --> sc-alert
  style sc-alert fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
