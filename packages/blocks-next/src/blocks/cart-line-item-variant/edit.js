import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

export default () => {
	const blockProps = useBlockProps();

	return (
		<div {...blockProps}>
			<div className="sc-cart-line-item-variant__option">
				{__('Small / Red', 'surecart')}
			</div>
		</div>
	);
};
