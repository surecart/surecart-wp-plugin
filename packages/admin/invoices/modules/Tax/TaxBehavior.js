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
import { ScBlockUi, ScRadio, ScRadioGroup } from '@surecart/components-react';
import { useInvoice } from '../../hooks/useInvoice';

export default () => {
	const { checkout, isDraftInvoice, busy, updateCheckout } = useInvoice();

	// Use internal state instead of a ref to make sure that the component
	// re-renders when the popover's anchor updates.
	const [popoverAnchor, setPopoverAnchor] = useState(null);

	// Memoize popoverProps to avoid returning a new object every time.
	const popoverProps = useMemo(
		() => ({ anchor: popoverAnchor, placement: 'bottom-end' }),
		[popoverAnchor]
	);

	const onChange = async () => {
		await updateCheckout({
			tax_behavior:
				checkout?.tax_behavior === 'inclusive'
					? 'exclusive'
					: 'inclusive',
		});
	};

	const label =
		checkout?.tax_behavior === 'inclusive'
			? __('Included', 'surecart')
			: __('Not Included', 'surecart');

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
				{__('Tax Inclusion', 'surecart')}
			</span>

			{isDraftInvoice ? (
				<Dropdown
					popoverProps={popoverProps}
					className="edit-post-post-url__dropdown"
					contentClassName="edit-post-post-url__dialog"
					focusOnMount
					renderToggle={({ isOpen, onToggle }) => (
						<PostDropdownButton
							isOpen={isOpen}
							onClick={onToggle}
							title={label}
							ariaLabel={__('Tax Inclusion', 'surecart')}
							css={css`
								margin-right: -18px;
							`}
						/>
					)}
					renderContent={({ onClose }) => (
						<PostDropdownContent>
							<InspectorPopoverHeader
								title={__('Tax Inclusion', 'surecart')}
								onClose={onClose}
							/>

							<ScRadioGroup onScChange={onChange}>
								<ScRadio
									value="inclusive"
									checked={
										checkout?.tax_behavior ===
											'inclusive' || false
									}
								>
									{__(
										'Included in product price',
										'surecart'
									)}
								</ScRadio>
								<ScRadio
									value="exclusive"
									checked={
										checkout?.tax_behavior ===
											'exclusive' || false
									}
								>
									{__(
										'Not included in product price',
										'surecart'
									)}
								</ScRadio>
							</ScRadioGroup>

							{busy && <ScBlockUi style={{ zIndex: 9 }} />}
						</PostDropdownContent>
					)}
				/>
			) : (
				<span
					css={css`
						display: inline-block;
						padding: 6px 0;
					`}
				>
					{label}
				</span>
			)}
		</PanelRow>
	);
};
