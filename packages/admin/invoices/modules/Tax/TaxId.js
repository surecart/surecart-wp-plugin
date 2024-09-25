/** @jsx jsx */
import { Global, css, jsx } from '@emotion/react';

/**
 * External dependencies.
 */
import { useMemo, useState, useEffect } from '@wordpress/element';
import { Dropdown, PanelRow } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { __experimentalInspectorPopoverHeader as InspectorPopoverHeader } from '@wordpress/block-editor';

/**
 * Internal dependencies.
 */
import PostDropdownButton from '../../../components/PostDropdownButton';
import PostDropdownContent from '../../../components/PostDropdownContent';
import { useInvoice } from '../../hooks/useInvoice';
import { ScBlockUi, ScButton, ScTaxIdInput } from '@surecart/components-react';

export default () => {
	const { checkout, isDraftInvoice, busy, updateCheckout } = useInvoice();
	const [taxId, setTaxId] = useState(checkout?.tax_identifier);

	// Local state when shipping address changes.
	useEffect(() => {
		setTaxId({
			number: checkout?.tax_identifier?.number,
			number_type: checkout?.tax_identifier?.number_type,
		});
	}, [checkout?.tax_identifier]);

	// Use internal state instead of a ref to make sure that the component
	// re-renders when the popover's anchor updates.
	const [popoverAnchor, setPopoverAnchor] = useState(null);

	// Memoize popoverProps to avoid returning a new object every time.
	const popoverProps = useMemo(
		() => ({ anchor: popoverAnchor, placement: 'bottom-end' }),
		[popoverAnchor]
	);

	const getTaxIdTitleDisplay = () => {
		if (!!checkout?.tax_identifier?.id) {
			return taxId?.number;
		}

		return isDraftInvoice
			? __('Add A Tax ID', 'surecart')
			: __('No Tax ID', 'surecart');
	};

	const taxIdLabels = {
		ca_gst: __('GST Number', 'surecart'),
		au_abn: __('ABN Number', 'surecart'),
		gb_vat: __('VAT Number', 'surecart'),
		eu_vat: __('VAT Number', 'surecart'),
	};

	const renderContent = ({ onClose }) => {
		return (
			<PostDropdownContent>
				<InspectorPopoverHeader
					title={
						!!checkout?.tax_identifier?.id
							? __('Edit Tax ID', 'surecart')
							: __('Add Tax ID', 'surecart')
					}
					onClose={onClose}
					actions={
						!!checkout?.tax_identifier?.id
							? [
									{
										label: __('Remove', 'surecart'),
										onClick: async () => {
											await updateCheckout({
												tax_identifier: null,
											});
											onClose();
										},
									},
							  ]
							: []
					}
				/>

				<div
					css={css`
						margin-top: 10px;
					`}
				>
					<ScTaxIdInput
						number={taxId?.number}
						type={taxId?.number_type}
						onScInput={(e) => setTaxId(e?.detail)}
					/>

					<ScButton
						css={css`
							margin-top: var(--sc-spacing-large);
						`}
						type="primary"
						onClick={async () => {
							await updateCheckout({ tax_identifier: taxId });
							onClose();
						}}
						disabled={
							taxId?.number ===
								checkout?.tax_identifier?.number &&
							taxId?.number_type ===
								checkout?.tax_identifier?.number_type
						}
					>
						{__('Update', 'surecart')}
					</ScButton>
				</div>

				{busy && <ScBlockUi style={{ zIndex: 9 }} />}
			</PostDropdownContent>
		);
	};

	return (
		<PanelRow
			css={css`
				align-items: flex-start;
				justify-content: space-between;
				width: 100%;
			`}
			ref={setPopoverAnchor}
		>
			<span
				css={css`
					display: block;
					flex-shrink: 0;
					padding: 6px 0;
					width: 45%;
				`}
			>
				{taxIdLabels[taxId?.number_type] ?? __('Tax ID', 'surecart')}
			</span>

			<Dropdown
				popoverProps={popoverProps}
				className="edit-tax__dropdown"
				contentClassName="edit-tax-popover__content"
				focusOnMount
				renderToggle={({ isOpen, onToggle }) => (
					<PostDropdownButton
						isOpen={isOpen}
						onClick={() =>
							isDraftInvoice ? onToggle() : undefined
						}
						title={getTaxIdTitleDisplay()}
						ariaLabel={__('Tax ID', 'surecart')}
					/>
				)}
				renderContent={renderContent}
			/>
			<Global
				styles={css`
					.edit-tax-popover__content .components-popover__content {
						overflow: visible !important;
					}
				`}
			/>
		</PanelRow>
	);
};
