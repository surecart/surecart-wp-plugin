# sc-product-item



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute | Description | Type                                        | Default     |
| -------------- | --------- | ----------- | ------------------------------------------- | ----------- |
| `layoutConfig` | --        |             | `{ blockName: string; attributes: any; }[]` | `undefined` |
| `product`      | --        |             | `Product`                                   | `undefined` |


## Dependencies

### Used by

 - [sc-product-item-list](../sc-product-item-list)

### Depends on

- [sc-product-item-title](../sc-product-item-title)
- [sc-product-item-image](../sc-product-item-image)
- [sc-product-item-price](../sc-product-item-price)

### Graph
```mermaid
graph TD;
  sc-product-item --> sc-product-item-title
  sc-product-item --> sc-product-item-image
  sc-product-item --> sc-product-item-price
  sc-product-item-price --> sc-price-range
  sc-price-range --> sc-format-number
  sc-product-item-list --> sc-product-item
  style sc-product-item fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
