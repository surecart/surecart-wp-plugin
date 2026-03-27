# sc-checkout-test-complete



<!-- Auto Generated Below -->


## Overview

This component listens to the order status
and confirms the order when payment is successful.

## Properties

| Property         | Attribute         | Description                                             | Type     | Default     |
| ---------------- | ----------------- | ------------------------------------------------------- | -------- | ----------- |
| `checkoutStatus` | `checkout-status` | Checkout status to listen and do payment related stuff. | `string` | `undefined` |
| `successUrl`     | `success-url`     | Success url.                                            | `string` | `undefined` |


## Events

| Event         | Description              | Type                    |
| ------------- | ------------------------ | ----------------------- |
| `scOrderPaid` | The order is paid event. | `CustomEvent<Checkout>` |
| `scSetState`  |                          | `CustomEvent<string>`   |


## Dependencies

### Used by

 - [sc-checkout](../checkout)

### Depends on

- [sc-dialog](../../../ui/sc-dialog)
- [sc-icon](../../../ui/icon)
- [sc-dashboard-module](../../../ui/dashboard-module)
- [sc-alert](../../../ui/alert)
- [sc-button](../../../ui/button)

### Graph
```mermaid
graph TD;
  sc-checkout-test-complete --> sc-dialog
  sc-checkout-test-complete --> sc-icon
  sc-checkout-test-complete --> sc-dashboard-module
  sc-checkout-test-complete --> sc-alert
  sc-checkout-test-complete --> sc-button
  sc-dialog --> sc-button
  sc-dialog --> sc-icon
  sc-button --> sc-spinner
  sc-dashboard-module --> sc-alert
  sc-alert --> sc-icon
  sc-checkout --> sc-checkout-test-complete
  style sc-checkout-test-complete fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
