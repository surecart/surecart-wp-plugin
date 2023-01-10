# sc-upgrade-required



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute  | Description     | Type                             | Default   |
| ---------- | ---------- | --------------- | -------------------------------- | --------- |
| `required` | `required` |                 | `boolean`                        | `true`    |
| `size`     | `size`     | The tag's size. | `"large" \| "medium" \| "small"` | `'small'` |


## Dependencies

### Depends on

- [sc-dialog](../sc-dialog)
- [sc-icon](../icon)
- [sc-button](../button)

### Graph
```mermaid
graph TD;
  sc-upgrade-required --> sc-dialog
  sc-upgrade-required --> sc-icon
  sc-upgrade-required --> sc-button
  sc-dialog --> sc-button
  sc-dialog --> sc-icon
  sc-button --> sc-spinner
  style sc-upgrade-required fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
