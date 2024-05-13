import { useBlockProps, PlainText } from '@wordpress/block-editor';
import { __, isRTL } from '@wordpress/i18n';
import Icon from '../../components/Icon';

const ARROWS = {
	none: '',
	arrow: isRTL() ? 'arrow-left' : 'arrow-right',
	chevron: isRTL() ? 'chevron-left' : 'chevron-right',
};

export default ({
	attributes: { label },
	setAttributes,
	context: { paginationArrow, showLabel },
}) => {
	const displayArrow = ARROWS[paginationArrow];

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

			{!!displayArrow && (
				<Icon
					name={displayArrow}
					className={`wp-block-surecart-product-pagination-next__icon`}
					aria-hidden={true}
				/>
			)}
		</a>
	);
};
