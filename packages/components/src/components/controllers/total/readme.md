# ce-total



<!-- Auto Generated Below -->


## Properties

| Property          | Attribute       | Description | Type                  | Default     |
| ----------------- | --------------- | ----------- | --------------------- | ----------- |
| `checkoutSession` | --              |             | `CheckoutSession`     | `undefined` |
| `loading`         | `loading`       |             | `boolean`             | `undefined` |
| `showCurrency`    | `show-currency` |             | `boolean`             | `undefined` |
| `size`            | `size`          |             | `"large" \| "medium"` | `undefined` |
| `total`           | `total`         |             | `string`              | `'total'`   |


## Dependencies

### Depends on

- [ce-line-item](../../ui/line-item)
- [ce-skeleton](../../ui/skeleton)

### Graph
```mermaid
graph TD;
  ce-total --> ce-line-item
  ce-total --> ce-skeleton
  style ce-total fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
