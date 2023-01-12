# ce-radio



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute  | Description                                                                                               | Type      | Default     |
| ---------- | ---------- | --------------------------------------------------------------------------------------------------------- | --------- | ----------- |
| `checked`  | `checked`  | Draws the radio in a checked state.                                                                       | `boolean` | `false`     |
| `disabled` | `disabled` | Is the radio disabled                                                                                     | `boolean` | `false`     |
| `edit`     | `edit`     | This will be true as a workaround in the block editor to focus on the content.                            | `boolean` | `undefined` |
| `invalid`  | `invalid`  | This will be true when the control is in an invalid state. Validity is determined by the `required` prop. | `boolean` | `false`     |
| `name`     | `name`     | The radios name attribute                                                                                 | `string`  | `undefined` |
| `required` | `required` | Is this required                                                                                          | `boolean` | `false`     |
| `value`    | `value`    | The radios value                                                                                          | `string`  | `undefined` |


## Events

| Event      | Description                                       | Type                |
| ---------- | ------------------------------------------------- | ------------------- |
| `scBlur`   | Emitted when the control loses focus.             | `CustomEvent<void>` |
| `scChange` | Emitted when the control's checked state changes. | `CustomEvent<void>` |
| `scFocus`  | Emitted when the control gains focus.             | `CustomEvent<void>` |


## Methods

### `ceClick() => Promise<void>`

Simulates a click on the radio.

#### Returns

Type: `Promise<void>`



### `reportValidity() => Promise<boolean>`

Checks for validity and shows the browser's validation message if the control is invalid.

#### Returns

Type: `Promise<boolean>`




## Shadow Parts

| Part             | Description                |
| ---------------- | -------------------------- |
| `"base"`         | The elements base wrapper. |
| `"checked-icon"` | Checked icon.              |
| `"control"`      | The control wrapper.       |
| `"label"`        | The label.                 |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
