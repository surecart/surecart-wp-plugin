# ce-select-dropdown



<!-- Auto Generated Below -->


## Properties

| Property            | Attribute            | Description                                                                                                                                                                                                   | Type                              | Default          |
| ------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- | ---------------- |
| `autocomplete`      | `autocomplete`       | The input's autocomplete attribute.                                                                                                                                                                           | `string`                          | `undefined`      |
| `choices`           | --                   | The input's value attribute.                                                                                                                                                                                  | `ChoiceItem[]`                    | `[]`             |
| `help`              | `help`               | Some help text for the input.                                                                                                                                                                                 | `string`                          | `undefined`      |
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
| `size`              | `size`               | The input's size.                                                                                                                                                                                             | `"large" \| "medium" \| "small"`  | `'medium'`       |
| `squared`           | `squared`            |                                                                                                                                                                                                               | `boolean`                         | `undefined`      |
| `squaredBottom`     | `squared-bottom`     |                                                                                                                                                                                                               | `boolean`                         | `undefined`      |
| `squaredLeft`       | `squared-left`       |                                                                                                                                                                                                               | `boolean`                         | `undefined`      |
| `squaredRight`      | `squared-right`      |                                                                                                                                                                                                               | `boolean`                         | `undefined`      |
| `squaredTop`        | `squared-top`        |                                                                                                                                                                                                               | `boolean`                         | `undefined`      |
| `value`             | `value`              | The input's value attribute.                                                                                                                                                                                  | `string`                          | `''`             |


## Events

| Event      | Description                                       | Type                  |
| ---------- | ------------------------------------------------- | --------------------- |
| `ceBlur`   | Emitted when the control loses focus.             | `CustomEvent<void>`   |
| `ceChange` | Emitted when the control's value changes.         | `CustomEvent<void>`   |
| `ceClose`  | Emitted whent the components search query changes | `CustomEvent<string>` |
| `ceFocus`  | Emitted when the control gains focus.             | `CustomEvent<void>`   |
| `ceOpen`   | Emitted whent the components search query changes | `CustomEvent<string>` |
| `ceSearch` | Emitted whent the components search query changes | `CustomEvent<string>` |


## Methods

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

 - [ce-address](../ce-address)

### Depends on

- [ce-menu-label](../menu-label)
- [ce-menu-item](../menu-item)
- [ce-form-control](../form-control)
- [ce-dropdown](../dropdown)
- [ce-icon](../icon)
- [ce-input](../input)
- [ce-spinner](../spinner)
- [ce-menu](../menu)

### Graph
```mermaid
graph TD;
  ce-select --> ce-menu-label
  ce-select --> ce-menu-item
  ce-select --> ce-form-control
  ce-select --> ce-dropdown
  ce-select --> ce-icon
  ce-select --> ce-input
  ce-select --> ce-spinner
  ce-select --> ce-menu
  ce-form-control --> ce-tooltip
  ce-input --> ce-form-control
  ce-address --> ce-select
  style ce-select fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
