# ce-line-items



<!-- Auto Generated Below -->


## Properties

| Property          | Attribute     | Description | Type              | Default     |
| ----------------- | ------------- | ----------- | ----------------- | ----------- |
| `calculating`     | `calculating` |             | `boolean`         | `false`     |
| `checkoutSession` | --            |             | `CheckoutSession` | `undefined` |
| `lineItemData`    | --            |             | `LineItemData[]`  | `undefined` |
| `loading`         | `loading`     |             | `boolean`         | `undefined` |


## Events

| Event               | Description | Type                          |
| ------------------- | ----------- | ----------------------------- |
| `ceUpdateLineItems` |             | `CustomEvent<LineItemData[]>` |


## Dependencies

### Depends on

- [ce-line-item](../../ui/line-item)
- [ce-skeleton](../../ui/skeleton)
- [ce-product-line-item](../../ui/product-line-item)

### Graph
```mermaid
graph TD;
  ce-line-items --> ce-line-item
  ce-line-items --> ce-skeleton
  ce-line-items --> ce-product-line-item
  ce-product-line-item --> ce-line-item
  ce-product-line-item --> ce-tag
  ce-product-line-item --> ce-quantity-select
  ce-quantity-select --> ce-dropdown
  ce-quantity-select --> ce-menu
  ce-quantity-select --> ce-menu-item
  style ce-line-items fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
