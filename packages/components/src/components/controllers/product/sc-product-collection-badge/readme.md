# sc-product-collection-badge



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description                                | Type                                                                     | Default     |
| -------- | --------- | ------------------------------------------ | ------------------------------------------------------------------------ | ----------- |
| `name`   | `name`    | Collection name                            | `string`                                                                 | `undefined` |
| `pill`   | `pill`    | Draws a pill-style tag with rounded edges. | `boolean`                                                                | `false`     |
| `size`   | `size`    | Collection tag size                        | `"large" \| "medium" \| "small"`                                         | `'medium'`  |
| `type`   | `type`    | Collection tag type                        | `"danger" \| "default" \| "info" \| "primary" \| "success" \| "warning"` | `undefined` |


## Dependencies

### Used by

 - [sc-product-collections](../sc-product-collections)

### Depends on

- [sc-tag](../../../ui/tag)

### Graph
```mermaid
graph TD;
  sc-product-collection-badge --> sc-tag
  sc-product-collections --> sc-product-collection-badge
  style sc-product-collection-badge fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
