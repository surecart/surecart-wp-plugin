# ce-text



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute  | Description | Type                                                  | Default |
| ---------- | ---------- | ----------- | ----------------------------------------------------- | ------- |
| `tag`      | `tag`      |             | `"h1" \| "h2" \| "h3" \| "h4" \| "h5" \| "h6" \| "p"` | `'p'`   |
| `truncate` | `truncate` |             | `boolean`                                             | `false` |


## Dependencies

### Used by

 - [sc-charges-list](../../controllers/dashboard/charges-list)
 - [sc-invoices-list](../../controllers/dashboard/invoices-list)
 - [sc-order-confirm-provider](../../providers/order-confirm-provider)
 - [sc-orders-list](../../controllers/dashboard/orders-list)
 - [sc-payment-method](../sc-payment-method)
 - [sc-stripe-element](../stripe-element)
 - [sc-stripe-payment-element](../stripe-payment-element)
 - [sc-subscription-details](../../controllers/dashboard/subscription-details)
 - [sc-upcoming-invoice](../../controllers/dashboard/upcoming-invoice)

### Graph
```mermaid
graph TD;
  sc-charges-list --> sc-text
  sc-invoices-list --> sc-text
  sc-order-confirm-provider --> sc-text
  sc-orders-list --> sc-text
  sc-payment-method --> sc-text
  sc-stripe-element --> sc-text
  sc-stripe-payment-element --> sc-text
  sc-subscription-details --> sc-text
  sc-upcoming-invoice --> sc-text
  style sc-text fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
