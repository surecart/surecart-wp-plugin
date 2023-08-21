import { __experimentalUseInnerBlocksProps, useInnerBlocksProps as __stableUseInnerBlocksProps, useBlockProps } from '@wordpress/block-editor';

export default [{
  "attributes": {
		"verticalAlignment": {
			"type": "string"
		},
		"isStackedOnMobile": {
			"type": "boolean",
			"default": true
		}
	},
  save({ attributes }) {
    const useInnerBlocksProps = __stableUseInnerBlocksProps
      ? __stableUseInnerBlocksProps
      : __experimentalUseInnerBlocksProps;

    const { isStackedOnMobile, verticalAlignment } = attributes;

    const blockProps = useBlockProps.save();
    const innerBlocksProps = useInnerBlocksProps.save(blockProps);

    return (
      <sc-columns
        vertical-alignment={verticalAlignment}
        is-stacked-on-mobile={isStackedOnMobile}
        {...innerBlocksProps}
      />
    );
  }
}]
