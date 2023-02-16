# sc-order-confirm-provider



<!-- Auto Generated Below -->


## Properties

| Property     | Attribute     | Description                  | Type               | Default     |
| ------------ | ------------- | ---------------------------- | ------------------ | ----------- |
| `formId`     | `form-id`     | The form id                  | `number`           | `undefined` |
| `mode`       | `mode`        | Are we in test or live mode. | `"live" \| "test"` | `'live'`    |
| `order`      | --            | The current order.           | `Checkout`         | `undefined` |
| `successUrl` | `success-url` | Success url.                 | `string`           | `undefined` |


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

- [order-confirm-modal](../../ui/order-confirm-modal)

### Graph
```mermaid
graph TD;
  sc-order-confirm-provider --> order-confirm-modal
  order-confirm-modal --> sc-dialog
  order-confirm-modal --> sc-flex
  order-confirm-modal --> sc-text
  order-confirm-modal --> sc-button
  sc-dialog --> sc-button
  sc-dialog --> sc-icon
  sc-button --> sc-spinner
  sc-checkout --> sc-order-confirm-provider
  style sc-order-confirm-provider fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
