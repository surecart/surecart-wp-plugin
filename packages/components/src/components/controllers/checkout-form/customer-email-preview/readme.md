# sc-customer-login



<!-- Auto Generated Below -->


## Dependencies

### Used by

 - [sc-customer-email](../customer-email)
 - [sc-customer-login](../customer-login)

### Depends on

- [sc-flex](../../../ui/flex)
- [sc-button](../../../ui/button)
- [sc-icon](../../../ui/icon)

### Graph
```mermaid
graph TD;
  sc-customer-email-preview --> sc-flex
  sc-customer-email-preview --> sc-button
  sc-customer-email-preview --> sc-icon
  sc-button --> sc-spinner
  sc-customer-email --> sc-customer-email-preview
  sc-customer-login --> sc-customer-email-preview
  style sc-customer-email-preview fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
