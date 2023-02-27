# sc-order-confirm-provider



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute     | Description                  | Type                                                      | Default     |
| ------------- | ------------- | ---------------------------- | --------------------------------------------------------- | ----------- |
| `formId`      | `form-id`     | The form id                  | `number`                                                  | `undefined` |
| `mode`        | `mode`        | Are we in test or live mode. | `"live" \| "test"`                                        | `'live'`    |
| `order`       | --            | The current order.           | `Checkout`                                                | `undefined` |
| `successText` | --            | Success text for the form.   | `{ title: string; description: string; button: string; }` | `undefined` |
| `successUrl`  | `success-url` | Success url.                 | `string`                                                  | `undefined` |


## Events

| Event         | Description              | Type                                                                                          |
| ------------- | ------------------------ | --------------------------------------------------------------------------------------------- |
| `scError`     | Error event.             | `CustomEvent<{ message: string; code?: string; data?: any; additional_errors?: any; } \| {}>` |
| `scOrderPaid` | The order is paid event. | `CustomEvent<Checkout>`                                                                       |
| `scSetState`  |                          | `CustomEvent<string>`                                                                         |


## Dependencies

### Used by

 - [sc-checkout](../../controllers/checkout-form/checkout)

### Depends on

- [sc-dialog](../../ui/sc-dialog)
- [sc-icon](../../ui/icon)
- [sc-dashboard-module](../../ui/dashboard-module)
- [sc-order-manual-instructions](../../controllers/confirmation/manual-instructions)
- [sc-button](../../ui/button)

### Graph
```mermaid
graph TD;
  sc-order-confirm-provider --> sc-dialog
  sc-order-confirm-provider --> sc-icon
  sc-order-confirm-provider --> sc-dashboard-module
  sc-order-confirm-provider --> sc-order-manual-instructions
  sc-order-confirm-provider --> sc-button
  sc-dialog --> sc-button
  sc-dialog --> sc-icon
  sc-button --> sc-spinner
  sc-dashboard-module --> sc-alert
  sc-alert --> sc-icon
  sc-order-manual-instructions --> sc-alert
  sc-checkout --> sc-order-confirm-provider
  style sc-order-confirm-provider fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
