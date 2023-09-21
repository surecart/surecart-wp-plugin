# sc-stripe-payment-element



<!-- Auto Generated Below -->


## Events

| Event                | Description                     | Type                                                                                            |
| -------------------- | ------------------------------- | ----------------------------------------------------------------------------------------------- |
| `scPaid`             | The order/invoice was paid for. | `CustomEvent<void>`                                                                             |
| `scPayError`         | There was a payment error.      | `CustomEvent<any>`                                                                              |
| `scPaymentInfoAdded` | Payment information was added   | `CustomEvent<PaymentInfoAddedParams>`                                                           |
| `scSetState`         | Set the state                   | `CustomEvent<"EXPIRE" \| "FETCH" \| "FINALIZE" \| "PAID" \| "PAYING" \| "REJECT" \| "RESOLVE">` |


## Methods

### `confirm(type: any, args?: {}) => Promise<void>`



#### Returns

Type: `Promise<void>`




## Dependencies

### Depends on

- [sc-text](../text)
- [sc-skeleton](../skeleton)

### Graph
```mermaid
graph TD;
  sc-stripe-payment-element --> sc-text
  sc-stripe-payment-element --> sc-skeleton
  style sc-stripe-payment-element fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
