# ce-tax-id-input



<!-- Auto Generated Below -->


## Properties

| Property     | Attribute    | Description           | Type                                                                                                                                          | Default                    |
| ------------ | ------------ | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| `draft`      | --           |                       | `{ shipping_country: string; }`                                                                                                               | `{ shipping_country: '' }` |
| `order`      | --           |                       | `Order`                                                                                                                                       | `undefined`                |
| `show`       | `show`       | Force show the field. | `boolean`                                                                                                                                     | `false`                    |
| `tax_status` | `tax_status` |                       | `"address_invalid" \| "calculated" \| "disabled" \| "estimated" \| "reverse_charged" \| "tax_registration_not_found" \| "tax_zone_not_found"` | `undefined`                |


## Dependencies

### Depends on

- [ce-icon](../../ui/icon)
- [ce-input](../../ui/input)
- [ce-dropdown](../../ui/dropdown)
- [ce-button](../../ui/button)
- [ce-menu](../../ui/menu)
- [ce-menu-item](../../ui/menu-item)

### Graph
```mermaid
graph TD;
  ce-tax-id-input --> ce-icon
  ce-tax-id-input --> ce-input
  ce-tax-id-input --> ce-dropdown
  ce-tax-id-input --> ce-button
  ce-tax-id-input --> ce-menu
  ce-tax-id-input --> ce-menu-item
  ce-input --> ce-form-control
  ce-form-control --> ce-tooltip
  ce-button --> ce-spinner
  style ce-tax-id-input fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
