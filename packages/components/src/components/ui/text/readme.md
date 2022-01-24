# ce-text



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute  | Description | Type                                                  | Default |
| ---------- | ---------- | ----------- | ----------------------------------------------------- | ------- |
| `tag`      | `tag`      |             | `"h1" \| "h2" \| "h3" \| "h4" \| "h5" \| "h6" \| "p"` | `'p'`   |
| `truncate` | `truncate` |             | `boolean`                                             | `false` |


## Dependencies

### Used by

 - [ce-customer-orders-list](../../controllers/dashboard/customer-orders-list)
 - [ce-orders-list](../../controllers/dashboard/orders-list)
 - [ce-subscription](../../controllers/dashboard/subscription)

### Graph
```mermaid
graph TD;
  ce-customer-orders-list --> ce-text
  ce-orders-list --> ce-text
  ce-subscription --> ce-text
  style ce-text fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
