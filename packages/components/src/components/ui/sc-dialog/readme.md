# sc-dialog



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute   | Description                                                                                                                                                        | Type      | Default |
| ---------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------- | ------- |
| `label`    | `label`     | The dialog's label as displayed in the header. You should always include a relevant label even when using `no-header`, as it is required for proper accessibility. | `string`  | `''`    |
| `noHeader` | `no-header` | Disables the header. This will also remove the default close button, so please ensure you provide an easy, accessible way for users to dismiss the dialog.         | `boolean` | `false` |
| `open`     | `open`      | Indicates whether or not the dialog is open. You can use this in lieu of the show/hide methods.                                                                    | `boolean` | `false` |


## Events

| Event            | Description         | Type                                                     |
| ---------------- | ------------------- | -------------------------------------------------------- |
| `scAfterHide`    |                     | `CustomEvent<void>`                                      |
| `scAfterShow`    |                     | `CustomEvent<void>`                                      |
| `scHide`         |                     | `CustomEvent<void>`                                      |
| `scInitialFocus` |                     | `CustomEvent<void>`                                      |
| `scRequestClose` | Request close event | `CustomEvent<"close-button" \| "keyboard" \| "overlay">` |
| `scShow`         |                     | `CustomEvent<void>`                                      |


## Shadow Parts

| Part             | Description |
| ---------------- | ----------- |
| `"base"`         |             |
| `"body"`         |             |
| `"close-button"` |             |
| `"footer"`       |             |
| `"header"`       |             |
| `"overlay"`      |             |
| `"panel"`        |             |
| `"title"`        |             |


## Dependencies

### Used by

 - [sc-cancel-dialog](../../controllers/dashboard/sc-cancel-dialog)
 - [sc-checkout-stock-alert](../../controllers/checkout-form/checkout/checkout-stock-alert)
 - [sc-checkout-test-complete](../../controllers/checkout-form/checkout-test-complete)
 - [sc-license](../../controllers/dashboard/sc-license)
 - [sc-login-provider](../../providers/sc-login-provider)
 - [sc-order-confirm-provider](../../providers/order-confirm-provider)
 - [sc-payment-methods-list](../../controllers/dashboard/payment-methods-list)
 - [sc-product-price-modal](../../controllers/product/sc-product-price-modal)
 - [sc-subscription-details](../../controllers/dashboard/subscription-details)
 - [sc-subscription-reactivate](../../controllers/dashboard/subscription-reactivate)
 - [sc-upgrade-required](../sc-upgrade-required)
 - [sc-upsell](../../controllers/upsell/sc-upsell)

### Depends on

- [sc-button](../button)
- [sc-icon](../icon)

### Graph
```mermaid
graph TD;
  sc-dialog --> sc-button
  sc-dialog --> sc-icon
  sc-button --> sc-spinner
  sc-cancel-dialog --> sc-dialog
  sc-checkout-stock-alert --> sc-dialog
  sc-checkout-test-complete --> sc-dialog
  sc-license --> sc-dialog
  sc-login-provider --> sc-dialog
  sc-order-confirm-provider --> sc-dialog
  sc-payment-methods-list --> sc-dialog
  sc-product-price-modal --> sc-dialog
  sc-subscription-details --> sc-dialog
  sc-subscription-reactivate --> sc-dialog
  sc-upgrade-required --> sc-dialog
  sc-upsell --> sc-dialog
  style sc-dialog fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
