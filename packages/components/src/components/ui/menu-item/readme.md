# ce-menu-item

<!-- Auto Generated Below -->


## Properties

| Property   | Attribute  | Description                                                                                               | Type      | Default     |
| ---------- | ---------- | --------------------------------------------------------------------------------------------------------- | --------- | ----------- |
| `checked`  | `checked`  | Draws the item in a checked state.                                                                        | `boolean` | `false`     |
| `disabled` | `disabled` | Draws the menu item in a disabled state.                                                                  | `boolean` | `false`     |
| `href`     | `href`     | Optional link to follow.                                                                                  | `string`  | `undefined` |
| `value`    | `value`    | A unique value to store in the menu item. This can be used as a way to identify menu items when selected. | `string`  | `''`        |


## Methods

### `setBlur() => Promise<void>`

Removes focus from the button.

#### Returns

Type: `Promise<void>`



### `setFocus(options?: FocusOptions) => Promise<void>`

Sets focus on the button.

#### Returns

Type: `Promise<void>`




## Shadow Parts

| Part             | Description |
| ---------------- | ----------- |
| `"base"`         |             |
| `"checked-icon"` |             |
| `"label"`        |             |
| `"prefix"`       |             |
| `"suffix"`       |             |


## Dependencies

### Used by

 - [ce-quantity-select](../quantity-select)
 - [ce-select](../select)

### Graph
```mermaid
graph TD;
  ce-quantity-select --> ce-menu-item
  ce-select --> ce-menu-item
  style ce-menu-item fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
