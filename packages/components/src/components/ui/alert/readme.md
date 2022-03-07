# ce-alert



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute  | Description                                                                                                                                                                                                           | Type                                                        | Default     |
| ---------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- | ----------- |
| `closable` | `closable` | Makes the alert closable.                                                                                                                                                                                             | `boolean`                                                   | `false`     |
| `duration` | `duration` | The length of time, in milliseconds, the alert will show before closing itself. If the user interacts with the alert before it closes (e.g. moves the mouse over it), the timer will restart. Defaults to `Infinity`. | `number`                                                    | `Infinity`  |
| `open`     | `open`     | Indicates whether or not the alert is open. You can use this in lieu of the show/hide methods.                                                                                                                        | `boolean`                                                   | `false`     |
| `type`     | `type`     | The type of alert.                                                                                                                                                                                                    | `"danger" \| "info" \| "primary" \| "success" \| "warning"` | `'primary'` |


## Events

| Event    | Description          | Type                |
| -------- | -------------------- | ------------------- |
| `ceHide` | When alert is hidden | `CustomEvent<void>` |
| `ceShow` | When alert is shown  | `CustomEvent<void>` |


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

 - [ce-checkout](../../controllers/checkout)
 - [ce-coupon-form](../coupon-form)
 - [ce-dashboard-module](../ce-dashboard-module)
 - [ce-login-form](../../controllers/login)
 - [ce-payment-method-create](../../controllers/dashboard/payment-method-create)
 - [ce-price-choice](../../controllers/price-choice)
 - [ce-stripe-payment-request](../stripe-payment-request)
 - [ce-subscription-cancel](../../controllers/dashboard/ce-subscription-cancel)
 - [ce-subscription-renew](../../controllers/dashboard/ce-subscription-renew)
 - [ce-upcoming-invoice](../../controllers/dashboard/upcoming-invoice)

### Depends on

- [ce-icon](../icon)

### Graph
```mermaid
graph TD;
  ce-alert --> ce-icon
  ce-checkout --> ce-alert
  ce-coupon-form --> ce-alert
  ce-dashboard-module --> ce-alert
  ce-login-form --> ce-alert
  ce-payment-method-create --> ce-alert
  ce-price-choice --> ce-alert
  ce-stripe-payment-request --> ce-alert
  ce-subscription-cancel --> ce-alert
  ce-subscription-renew --> ce-alert
  ce-upcoming-invoice --> ce-alert
  style ce-alert fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
