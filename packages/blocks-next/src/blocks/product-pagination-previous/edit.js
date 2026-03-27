import { useBlockProps, PlainText } from '@wordpress/block-editor';
import { __, isRTL } from '@wordpress/i18n';
import Icon from '../../components/Icon';

const ARROWS = {
	none: '',
	arrow: isRTL() ? 'arrow-right' : 'arrow-left',
	chevron: isRTL() ? 'chevron-right' : 'chevron-left',
};

export default ({
	attributes: { label },
	setAttributes,
	context: { paginationArrow, showLabel },
}) => {
	const displayArrow = ARROWS[paginationArrow];

	const blockProps = useBlockProps({
		href: '#',
		onClick: (e) => e.preventDefault(),
		className: 'has-arrow-type-' + paginationArrow,
	});

	return (
		<a {...blockProps}>
			{!!displayArrow && (
				<Icon
					name={displayArrow}
					className={`wp-block-surecart-product-pagination-next__icon`}
					aria-hidden={true}
				/>
			)}

			{showLabel && (
				<PlainText
					__experimentalVersion={2}
					tagName="span"
					aria-label={__('Previous page link')}
					placeholder={__('Previous')}
					value={label}
					onChange={(newLabel) => setAttributes({ label: newLabel })}
				/>
			)}
		</a>
	);
};
