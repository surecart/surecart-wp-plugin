import { __ } from '@wordpress/i18n';

import { useBlockProps } from '@wordpress/block-editor';
import {
	useInnerBlocksProps as __stableUseInnerBlocksProps,
	__experimentalUseInnerBlocksProps,
} from '@wordpress/block-editor';

export default () => {
	const blockProps = useBlockProps();
	const useInnerBlocksProps = __stableUseInnerBlocksProps
		? __stableUseInnerBlocksProps
		: __experimentalUseInnerBlocksProps;

	const innerBlocksProps = useInnerBlocksProps(
		{},
		{
			allowedBlocks: ['surecart/product-variant-pills-wrapper'],
			renderAppender: false,
			template: [['surecart/product-variant-pills-wrapper']],
		}
	);

	return (
		<div class="sc-product-variants__wrapper">
			<div {...blockProps}>
				<label className="sc-form-label">
					{__('Colors', 'surecart')}
				</label>

				<div {...innerBlocksProps}></div>
			</div>
		</div>
	);
};
