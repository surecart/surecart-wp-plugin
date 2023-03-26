# ce-cart-provider



<!-- Auto Generated Below -->


## Properties

| Property  | Attribute | Description                                 | Type            | Default |
| --------- | --------- | ------------------------------------------- | --------------- | ------- |
| `persist` | `persist` | Should we persist the session.              | `boolean`       | `true`  |
| `prices`  | --        | An array of prices to pre-fill in the form. | `PriceChoice[]` | `[]`    |


## Events

| Event                | Description             | Type                                                                                            |
| -------------------- | ----------------------- | ----------------------------------------------------------------------------------------------- |
| `scError`            | Error event             | `CustomEvent<{ message: string; code?: string; data?: any; additional_errors?: any; } \| {}>`   |
| `scPaid`             |                         | `CustomEvent<void>`                                                                             |
| `scSetState`         | Set the state           | `CustomEvent<"EXPIRE" \| "FETCH" \| "FINALIZE" \| "PAID" \| "PAYING" \| "REJECT" \| "RESOLVE">` |
| `scUpdateDraftState` | Update line items event | `CustomEvent<Checkout>`                                                                         |
| `scUpdateOrderState` | Update line items event | `CustomEvent<Checkout>`                                                                         |


## Methods

### `finalize() => Promise<Checkout | NodeJS.Timeout>`

Finalize the order.

#### Returns

Type: `Promise<Checkout | Timeout>`




## Dependencies

### Used by

 - [sc-checkout](../../controllers/checkout-form/checkout)

### Depends on

- [sc-line-items-provider](../line-items-provider)

### Graph
```mermaid
graph TD;
  sc-session-provider --> sc-line-items-provider
  sc-checkout --> sc-session-provider
  style sc-session-provider fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
