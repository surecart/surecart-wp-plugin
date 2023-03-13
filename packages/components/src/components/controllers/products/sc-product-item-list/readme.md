# sc-product-item-list



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute     | Description | Type                                        | Default     |
| -------------- | ------------- | ----------- | ------------------------------------------- | ----------- |
| `formId`       | `form-id`     |             | `string`                                    | `undefined` |
| `itemStyles`   | `item-styles` |             | `any`                                       | `{}`        |
| `layoutConfig` | --            |             | `{ blockName: string; attributes: any; }[]` | `undefined` |
| `mode`         | `mode`        |             | `"live" \| "test"`                          | `undefined` |


## Dependencies

### Depends on

- [sc-skeleton](../../../ui/skeleton)
- [sc-product-item](../sc-product-item)

### Graph
```mermaid
graph TD;
  sc-product-item-list --> sc-skeleton
  sc-product-item-list --> sc-product-item
  sc-product-item --> sc-product-item-title
  sc-product-item --> sc-product-item-image
  sc-product-item --> sc-price-range
  sc-price-range --> sc-format-number
  style sc-product-item-list fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
