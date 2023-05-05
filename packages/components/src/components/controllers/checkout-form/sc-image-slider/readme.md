# sc-product-image-carousel



<!-- Auto Generated Below -->


## Properties

| Property            | Attribute             | Description | Type                                                                         | Default     |
| ------------------- | --------------------- | ----------- | ---------------------------------------------------------------------------- | ----------- |
| `hasThumbnails`     | `has-thumbnails`      |             | `boolean`                                                                    | `undefined` |
| `images`            | --                    |             | `{ src: string; alt: string; srcset: any; width: number; sizes: string; }[]` | `[]`        |
| `thumbnails`        | --                    |             | `{ src: string; alt: string; srcset: any; width: number; sizes: string; }[]` | `[]`        |
| `thumbnailsPerPage` | `thumbnails-per-page` |             | `number`                                                                     | `5`         |


## Shadow Parts

| Part     | Description |
| -------- | ----------- |
| `"base"` |             |


## Dependencies

### Depends on

- [sc-icon](../../../ui/icon)

### Graph
```mermaid
graph TD;
  sc-image-slider --> sc-icon
  style sc-image-slider fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
