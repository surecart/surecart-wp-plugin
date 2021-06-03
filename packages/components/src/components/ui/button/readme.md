# ce-button

<!-- Auto Generated Below -->

## Properties

| Property   | Attribute  | Description                                                                                            | Type                                                                               | Default     |
| ---------- | ---------- | ------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- | ----------- |
| `caret`    | `caret`    | Draws the button with a caret for use with dropdowns, popovers, etc.                                   | `boolean`                                                                          | `false`     |
| `circle`   | `circle`   | Draws a circle button.                                                                                 | `boolean`                                                                          | `false`     |
| `disabled` | `disabled` | Disables the button.                                                                                   | `boolean`                                                                          | `false`     |
| `download` | `download` | Tells the browser to download the linked file as this filename. Only used when `href` is set.          | `string`                                                                           | `undefined` |
| `full`     | `full`     | Draws the button with a caret for use with dropdowns, popovers, etc.                                   | `boolean`                                                                          | `false`     |
| `href`     | `href`     | When set, the underlying button will be rendered as an `<a>` with this `href` instead of a `<button>`. | `string`                                                                           | `undefined` |
| `loading`  | `loading`  | Draws the button in a loading state.                                                                   | `boolean`                                                                          | `false`     |
| `name`     | `name`     | An optional name for the button. Ignored when `href` is set.                                           | `string`                                                                           | `undefined` |
| `pill`     | `pill`     | Draws a pill-style button with rounded edges.                                                          | `boolean`                                                                          | `false`     |
| `size`     | `size`     | The button's size.                                                                                     | `"large" \| "medium" \| "small"`                                                   | `'medium'`  |
| `submit`   | `submit`   | Indicates if activating the button should submit the form. Ignored when `href` is set.                 | `boolean`                                                                          | `false`     |
| `target`   | `target`   | Tells the browser where to open the link. Only used when `href` is set.                                | `"_blank" \| "_parent" \| "_self" \| "_top"`                                       | `undefined` |
| `type`     | `type`     | The button's type.                                                                                     | `"danger" \| "default" \| "info" \| "primary" \| "success" \| "text" \| "warning"` | `'default'` |
| `value`    | `value`    | An optional value for the button. Ignored when `href` is set.                                          | `string`                                                                           | `undefined` |

## Events

| Event     | Description                          | Type                |
| --------- | ------------------------------------ | ------------------- |
| `ceBlur`  | Emitted when the button loses focus. | `CustomEvent<void>` |
| `ceFocus` | Emitted when the button gains focus. | `CustomEvent<void>` |

## Shadow Parts

| Part       | Description |
| ---------- | ----------- |
| `"base"`   |             |
| `"caret"`  |             |
| `"label"`  |             |
| `"prefix"` |             |
| `"suffix"` |             |

## Dependencies

### Depends on

- [ce-spinner](../spinner)

### Graph

```mermaid
graph TD;
  ce-button --> ce-spinner
  style ce-button fill:#f9f,stroke:#333,stroke-width:4px
```

---

_Built with [StencilJS](https://stenciljs.com/)_
