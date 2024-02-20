# sc-upsell



<!-- Auto Generated Below -->


## Dependencies

### Depends on

- [sc-format-number](../../../util/format-number)
- [sc-summary](../../../ui/sc-summary)
- [sc-divider](../../../ui/divider)
- [sc-line-item](../../../ui/line-item)

### Graph
```mermaid
graph TD;
  sc-upsell-totals --> sc-format-number
  sc-upsell-totals --> sc-summary
  sc-upsell-totals --> sc-divider
  sc-upsell-totals --> sc-line-item
  sc-summary --> sc-line-item
  sc-summary --> sc-skeleton
  style sc-upsell-totals fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
