import { useBlockProps, PlainText } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

const arrowMap = {
	none: '',
	arrow: '→',
	chevron: '»',
};

export default ({
	attributes: { label },
	setAttributes,
	context: { paginationArrow, showLabel },
}) => {
	const displayArrow = arrowMap[paginationArrow];

	const blockProps = useBlockProps({
		className: 'has-arrow-type-' + paginationArrow,
	});

	return (
		<a href="#" onClick={(e) => e.preventDefault()} {...blockProps}>
			{showLabel && (
				<PlainText
					__experimentalVersion={2}
					tagName="span"
					aria-label={__('Next page link')}
					placeholder={__('Next')}
					value={label}
					onChange={(newLabel) => setAttributes({ label: newLabel })}
				/>
			)}
			{displayArrow && (
				<span
					className={`wp-block-surecart-product-pagination-previous__icon`}
					aria-hidden={true}
				>
					{displayArrow}
				</span>
			)}
		</a>
	);
};
