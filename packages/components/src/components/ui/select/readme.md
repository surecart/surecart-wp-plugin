# ce-select-dropdown



<!-- Auto Generated Below -->


## Properties

| Property            | Attribute            | Description                                                                                                                                                                                                   | Type                              | Default          |
| ------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- | ---------------- |
| `autocomplete`      | `autocomplete`       | The input's autocomplete attribute.                                                                                                                                                                           | `string`                          | `undefined`      |
| `choices`           | --                   | The input's value attribute.                                                                                                                                                                                  | `ChoiceItem[]`                    | `[]`             |
| `disabled`          | `disabled`           |                                                                                                                                                                                                               | `boolean`                         | `undefined`      |
| `help`              | `help`               | Some help text for the input.                                                                                                                                                                                 | `string`                          | `undefined`      |
| `hoist`             | `hoist`              |                                                                                                                                                                                                               | `boolean`                         | `false`          |
| `invalid`           | `invalid`            | This will be true when the control is in an invalid state. Validity is determined by props such as `type`, `required`, `minlength`, `maxlength`, and `pattern` using the browser's constraint validation API. | `boolean`                         | `false`          |
| `label`             | `label`              | The input's label.                                                                                                                                                                                            | `string`                          | `undefined`      |
| `loading`           | `loading`            |                                                                                                                                                                                                               | `boolean`                         | `undefined`      |
| `name`              | `name`               | The input's name attribute.                                                                                                                                                                                   | `string`                          | `undefined`      |
| `open`              | `open`               | Is this open                                                                                                                                                                                                  | `boolean`                         | `undefined`      |
| `placeholder`       | `placeholder`        | Placeholder for no value                                                                                                                                                                                      | `string`                          | `''`             |
| `position`          | `position`           |                                                                                                                                                                                                               | `"bottom-left" \| "bottom-right"` | `'bottom-right'` |
| `required`          | `required`           |                                                                                                                                                                                                               | `boolean`                         | `undefined`      |
| `search`            | `search`             | Is search enabled?                                                                                                                                                                                            | `boolean`                         | `undefined`      |
| `searchPlaceholder` | `search-placeholder` | Placeholder for search                                                                                                                                                                                        | `string`                          | `''`             |
| `showParentLabel`   | `show-parent-label`  |                                                                                                                                                                                                               | `boolean`                         | `true`           |
| `size`              | `size`               | The input's size.                                                                                                                                                                                             | `"large" \| "medium" \| "small"`  | `'medium'`       |
| `squared`           | `squared`            |                                                                                                                                                                                                               | `boolean`                         | `undefined`      |
| `squaredBottom`     | `squared-bottom`     |                                                                                                                                                                                                               | `boolean`                         | `undefined`      |
| `squaredLeft`       | `squared-left`       |                                                                                                                                                                                                               | `boolean`                         | `undefined`      |
| `squaredRight`      | `squared-right`      |                                                                                                                                                                                                               | `boolean`                         | `undefined`      |
| `squaredTop`        | `squared-top`        |                                                                                                                                                                                                               | `boolean`                         | `undefined`      |
| `unselect`          | `unselect`           | Can we unselect items.                                                                                                                                                                                        | `boolean`                         | `true`           |
| `value`             | `value`              | The input's value attribute.                                                                                                                                                                                  | `string`                          | `''`             |


## Events

| Event      | Description                                       | Type                  |
| ---------- | ------------------------------------------------- | --------------------- |
| `scBlur`   | Emitted when the control loses focus.             | `CustomEvent<void>`   |
| `scChange` | Emitted when the control's value changes.         | `CustomEvent<void>`   |
| `scClose`  | Emitted whent the components search query changes | `CustomEvent<string>` |
| `scFocus`  | Emitted when the control gains focus.             | `CustomEvent<void>`   |
| `scOpen`   | Emitted whent the components search query changes | `CustomEvent<string>` |
| `scSearch` | Emitted whent the components search query changes | `CustomEvent<string>` |


## Methods

### `reportValidity() => Promise<boolean>`



#### Returns

Type: `Promise<boolean>`



### `setCustomValidity(message: string) => Promise<void>`

Sets a custom validation message. If `message` is not empty, the field will be considered invalid.

#### Returns

Type: `Promise<void>`




## Shadow Parts

| Part       | Description |
| ---------- | ----------- |
| `"caret"`  |             |
| `"search"` |             |


## Dependencies

### Used by

 - [sc-address](../address)
 - [sc-compact-address](../sc-compact-address)

### Depends on

- [sc-icon](../icon)
- [sc-menu-label](../menu-label)
- [sc-menu-item](../menu-item)
- [sc-form-control](../form-control)
- [sc-dropdown](../dropdown)
- [sc-input](../input)
- [sc-spinner](../spinner)
- [sc-menu](../menu)

### Graph
```mermaid
graph TD;
  sc-select --> sc-icon
  sc-select --> sc-menu-label
  sc-select --> sc-menu-item
  sc-select --> sc-form-control
  sc-select --> sc-dropdown
  sc-select --> sc-input
  sc-select --> sc-spinner
  sc-select --> sc-menu
  sc-form-control --> sc-tooltip
  sc-input --> sc-form-control
  sc-address --> sc-select
  sc-compact-address --> sc-select
  style sc-select fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
