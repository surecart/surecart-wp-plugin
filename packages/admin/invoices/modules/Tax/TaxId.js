/** @jsx jsx */
import { css, jsx } from '@emotion/react';

/**
 * External dependencies.
 */
import { useMemo, useState } from '@wordpress/element';
import { Dropdown, PanelRow } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { __experimentalInspectorPopoverHeader as InspectorPopoverHeader } from '@wordpress/block-editor';

/**
 * Internal dependencies.
 */
import PostDropdownButton from '../../../components/PostDropdownButton';
import PostDropdownContent from '../../../components/PostDropdownContent';
import TaxIdDisplay from './TaxIdDisplay';
import { ScBlockUi, ScButton, ScTaxIdInput } from '@surecart/components-react';

export default ({ invoice, onChange, busy }) => {
	const isDraftInvoice = invoice?.status === 'draft';
	const [taxId, setTaxId] = useState(invoice?.checkout?.tax_identifier);

	// Use internal state instead of a ref to make sure that the component
	// re-renders when the popover's anchor updates.
	const [popoverAnchor, setPopoverAnchor] = useState(null);

	// Memoize popoverProps to avoid returning a new object every time.
	const popoverProps = useMemo(
		() => ({ anchor: popoverAnchor, placement: 'bottom-end' }),
		[popoverAnchor]
	);

	const renderContent = ({ onClose }) => {
		return (
			<PostDropdownContent>
				<InspectorPopoverHeader
					title={
						!!invoice?.checkout?.tax_identifier?.id
							? __('Edit Tax ID', 'surecart')
							: __('Add Tax ID', 'surecart')
					}
					onClose={onClose}
					actions={
						!!invoice?.checkout?.tax_identifier?.id
							? [
									{
										label: __('Remove', 'surecart'),
										onClick: async () => {
											await onChange({
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
						isPrimary
						onClick={async () => {
							await onChange({ tax_identifier: taxId });
							onClose();
						}}
						disabled={!taxId?.number}
					>
						{__('Save', 'surecart')}
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
				{__('Tax ID', 'surecart')}
			</span>
			<Dropdown
				popoverProps={popoverProps}
				className="edit-post-post-url__dropdown"
				contentClassName="edit-post-post-url__dialog"
				focusOnMount
				renderToggle={({ isOpen, onToggle }) => (
					<PostDropdownButton
						isOpen={isOpen}
						onClick={() =>
							isDraftInvoice ? onToggle() : undefined
						}
						title={
							!!invoice?.checkout?.tax_identifier?.id ? (
								<TaxIdDisplay taxId={taxId} />
							) : (
								__('Add A Tax ID', 'surecart')
							)
						}
						ariaLabel={__('Tax ID', 'surecart')}
					/>
				)}
				renderContent={renderContent}
			/>
		</PanelRow>
	);
};
