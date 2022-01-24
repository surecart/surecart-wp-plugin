# ce-address



<!-- Auto Generated Below -->


## Properties

| Property          | Attribute  | Description | Type      | Default     |
| ----------------- | ---------- | ----------- | --------- | ----------- |
| `busy`            | `busy`     |             | `boolean` | `undefined` |
| `label`           | `label`    |             | `string`  | `undefined` |
| `loading`         | `loading`  |             | `boolean` | `undefined` |
| `required`        | `required` |             | `boolean` | `true`      |
| `shippingAddress` | --         |             | `Address` | `undefined` |


## Shadow Parts

| Part        | Description |
| ----------- | ----------- |
| `"control"` |             |


## Dependencies

### Depends on

- [ce-input](../input)
- [ce-form-control](../form-control)
- [ce-skeleton](../skeleton)
- [ce-select](../select)
- [ce-block-ui](../block-ui)

### Graph
```mermaid
graph TD;
  ce-address --> ce-input
  ce-address --> ce-form-control
  ce-address --> ce-skeleton
  ce-address --> ce-select
  ce-address --> ce-block-ui
  ce-input --> ce-form-control
  ce-form-control --> ce-tooltip
  ce-select --> ce-menu-label
  ce-select --> ce-menu-item
  ce-select --> ce-dropdown
  ce-select --> ce-icon
  ce-select --> ce-input
  ce-select --> ce-spinner
  ce-select --> ce-menu
  ce-block-ui --> ce-spinner
  style ce-address fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
