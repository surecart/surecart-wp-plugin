# ce-text



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute  | Description | Type                                                  | Default |
| ---------- | ---------- | ----------- | ----------------------------------------------------- | ------- |
| `tag`      | `tag`      |             | `"h1" \| "h2" \| "h3" \| "h4" \| "h5" \| "h6" \| "p"` | `'p'`   |
| `truncate` | `truncate` |             | `boolean`                                             | `false` |


## Dependencies

### Used by

 - [ce-charges-list](../../controllers/dashboard/charges-list)
 - [ce-invoices-list](../../controllers/dashboard/invoices-list)
 - [ce-orders-list](../../controllers/dashboard/orders-list)
 - [ce-stripe-element](../stripe-element)
 - [ce-subscription-details](../../controllers/dashboard/ce-subscription-details)
 - [ce-upcoming-invoice](../../controllers/dashboard/upcoming-invoice)

### Graph
```mermaid
graph TD;
  ce-charges-list --> ce-text
  ce-invoices-list --> ce-text
  ce-orders-list --> ce-text
  ce-stripe-element --> ce-text
  ce-subscription-details --> ce-text
  ce-upcoming-invoice --> ce-text
  style ce-text fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
