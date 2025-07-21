import { useBlockProps } from '@wordpress/block-editor';
import { ScIcon } from '@surecart/components-react';
import { __, sprintf } from '@wordpress/i18n';

export default ({ context: { editable = true } }) => {
	const blockProps = useBlockProps({
		className: editable
			? 'sc-input-group sc-quantity-selector sc-input-group-sm'
			: null,
	});

	if (!editable) {
		return (
			<div {...blockProps}>{sprintf(__('Qty: %d', 'surecart'), 1)}</div>
		);
	}

	return (
		<div {...blockProps}>
			<div
				className="sc-input-group-text sc-quantity-selector__decrease"
				role="button"
				tabindex="0"
				aria-label={__('Decrease quantity by one.', 'surecart')}
			>
				<ScIcon name="minus" />
			</div>
			<input
				type="number"
				className="sc-form-control sc-quantity-selector__control"
				value={1}
				step="1"
				autocomplete="off"
				role="spinbutton"
			/>
			<div
				className="sc-input-group-text sc-quantity-selector__increase"
				role="button"
				tabindex="0"
				aria-label={__('Increase quantity by one.', 'surecart')}
			>
				<ScIcon name="plus" />
			</div>
		</div>
	);
};
