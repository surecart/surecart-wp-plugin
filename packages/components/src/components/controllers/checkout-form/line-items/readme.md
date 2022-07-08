# ce-line-items



<!-- Auto Generated Below -->


## Properties

| Property          | Attribute           | Description | Type                       | Default     |
| ----------------- | ------------------- | ----------- | -------------------------- | ----------- |
| `editLineItems`   | `edit-line-items`   |             | `boolean`                  | `true`      |
| `editable`        | `editable`          |             | `boolean`                  | `undefined` |
| `loading`         | `loading`           |             | `boolean`                  | `undefined` |
| `lockedChoices`   | --                  |             | `PriceChoice[]`            | `[]`        |
| `order`           | --                  |             | `Order`                    | `undefined` |
| `prices`          | --                  |             | `{ [id: string]: Price; }` | `undefined` |
| `removable`       | `removable`         |             | `boolean`                  | `undefined` |
| `removeLineItems` | `remove-line-items` |             | `boolean`                  | `true`      |


## Events

| Event              | Description           | Type                        |
| ------------------ | --------------------- | --------------------------- |
| `scRemoveLineItem` | Remove the line item. | `CustomEvent<LineItemData>` |
| `scUpdateLineItem` | Update the line item. | `CustomEvent<LineItemData>` |


## Dependencies

### Depends on

- [sc-line-item](../../../ui/line-item)
- [sc-skeleton](../../../ui/skeleton)
- [sc-product-line-item](../../../ui/product-line-item)

### Graph
```mermaid
graph TD;
  sc-line-items --> sc-line-item
  sc-line-items --> sc-skeleton
  sc-line-items --> sc-product-line-item
  sc-product-line-item --> sc-format-number
  sc-product-line-item --> sc-quantity-select
  sc-product-line-item --> sc-icon
  sc-quantity-select --> sc-icon
  style sc-line-items fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
