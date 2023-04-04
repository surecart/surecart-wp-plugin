import { Component, h, Prop } from '@stencil/core';
import { getColorPresetCssVar, getFontSizePresetCssVar, getSpacingPresetCssVar } from '../../../../functions/util';
import { Product } from '../../../../types';
import { LayoutConfig } from '../sc-product-item-list/sc-product-item-list';

@Component({
  tag: 'sc-product-item',
  styleUrl: 'sc-product-item.scss',
  shadow: true,
})
export class ScProductItem {
  /* Product */
  @Prop() product: Product;

  /* Product Layout Config */
  @Prop() layoutConfig: LayoutConfig;

  render() {
    return (
      <a href={this.product?.permalink} class={{ 'product-item': true }}>
        {this.product &&
          this.layoutConfig.map(layout => {
            const spacing = layout.attributes?.style?.spacing;
            const border = layout.attributes?.style?.border;
            const typography = layout.attributes?.style?.typography;
            const color = layout.attributes?.style?.color;

            switch (layout.blockName) {
              case 'surecart/product-item-title':
                return (
                  <sc-product-item-title
                    style={{
                      '--sc-product-title-font-size': layout.attributes?.fontSize ? getFontSizePresetCssVar(layout.attributes?.fontSize) : typography?.fontSize,
                      '--sc-product-title-text-color': layout.attributes?.textColor ? getColorPresetCssVar(layout.attributes?.textColor) : color?.text,
                      '--sc-product-title-padding-top': spacing?.padding?.top && getSpacingPresetCssVar(spacing.padding.top),
                      '--sc-product-title-padding-bottom': spacing?.padding?.bottom && getSpacingPresetCssVar(spacing.padding.bottom),
                      '--sc-product-title-align': layout.attributes?.align,
                      '--sc-product-title-font-weight': typography?.fontWeight,
                    }}
                  >
                    {this.product?.name}
                  </sc-product-item-title>
                );

              case 'surecart/product-item-image':
                return (
                  <sc-product-item-image
                    src={this.product?.image_url}
                    sizing={layout.attributes?.sizing}
                    style={{
                      '--sc-product-image-padding-top': spacing?.padding?.top && getSpacingPresetCssVar(spacing.padding.top),
                      '--sc-product-image-padding-bottom': spacing?.padding?.bottom && getSpacingPresetCssVar(spacing.padding.bottom),
                      '--sc-product-image-padding-left': spacing?.padding?.left && getSpacingPresetCssVar(spacing.padding.left),
                      '--sc-product-image-padding-right': spacing?.padding?.right && getSpacingPresetCssVar(spacing.padding.right),
                      '--sc-product-image-margin-top': spacing?.margin?.top && getSpacingPresetCssVar(spacing.margin.top),
                      '--sc-product-image-margin-bottom': spacing?.margin?.bottom && getSpacingPresetCssVar(spacing.margin.bottom),
                      '--sc-product-image-margin-left': spacing?.margin?.left && getSpacingPresetCssVar(spacing.margin.left),
                      '--sc-product-image-margin-right': spacing?.margin?.right && getSpacingPresetCssVar(spacing.margin.right),
                      '--sc-product-image-border-color': layout.attributes?.borderColor,
                      '--sc-product-image-border-radius': border?.radius,
                      '--sc-product-image-border-width': border?.width,
                      '--sc-product-image-aspect-ratio': layout.attributes?.ratio,
                    }}
                  ></sc-product-item-image>
                );

              case 'surecart/product-item-price':
                return (
                  <sc-product-item-price
                    style={{
                      '--sc-product-price-padding-top': spacing?.padding?.top && getSpacingPresetCssVar(spacing.padding.top),
                      '--sc-product-price-padding-bottom': spacing?.padding?.bottom && getSpacingPresetCssVar(spacing.padding.bottom),
                      '--sc-product-price-padding-left': spacing?.padding?.left && getSpacingPresetCssVar(spacing.padding.left),
                      '--sc-product-price-padding-right': spacing?.padding?.right && getSpacingPresetCssVar(spacing.padding.right),
                      '--sc-product-price-font-size': layout.attributes?.fontSize ? getFontSizePresetCssVar(layout.attributes?.fontSize) : typography?.fontSize,
                      '--sc-product-price-text-color': layout.attributes?.textColor ? getColorPresetCssVar(layout.attributes?.textColor) : color?.text,
                      '--sc-product-price-align': layout.attributes?.align,
                      '--sc-product-price-font-weight': typography?.fontWeight,
                    }}
                    prices={this.product?.prices.data}
                  ></sc-product-item-price>
                );

              default:
                return null;
            }
          })}
      </a>
    );
  }
}
