/** @jsx jsx */
import { css, jsx } from '@emotion/react';

/**
 * WordPress dependencies.
 */
import { useMemo, useState } from '@wordpress/element';
import {
	PanelRow,
	Dropdown,
	Button,
	DateTimePicker,
} from '@wordpress/components';
import { __experimentalInspectorPopoverHeader as InspectorPopoverHeader } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { getDate } from '@wordpress/date';
import { formatDateTime } from '../../../util/time';

export default ({ product, updateProduct }) => {
	// Use internal state instead of a ref to make sure that the component
	// re-renders when the popover's anchor updates.
	const [popoverAnchor, setPopoverAnchor] = useState(null);
	// Memoize popoverProps to avoid returning a new object every time.
	const popoverProps = useMemo(
		() => ({ anchor: popoverAnchor, placement: 'bottom-end' }),
		[popoverAnchor]
	);

	const onChangeDate = (date) => {
		// Ensure the date is not in the future.
		if (Date.parse(date) > Date.parse(new Date())) {
			date = new Date();
		}

		date = getDate(date);

		// Update product with the new cataloged_at value.
		updateProduct({
			cataloged_at: Date.parse(date?.toUTCString()) / 1000,
		});
	};

	return (
		<PanelRow ref={setPopoverAnchor}>
			<span>{__('Cataloged at', 'surecart')}</span>
			<Dropdown
				popoverProps={popoverProps}
				focusOnMount
				renderToggle={({ isOpen, onToggle }) => (
					<RenderDropdownButton
						isOpen={isOpen}
						onClick={onToggle}
						product={product}
					/>
				)}
				renderContent={({ onClose }) => (
					<div
						css={css`
							min-width: 248px;
							margin: 8px;

							.block-editor-inspector-popover-header {
								margin-bottom: 16px;
							}
							[class].block-editor-inspector-popover-header__action.has-icon {
								min-width: 24px;
								padding: 0;
							}
							[class].block-editor-inspector-popover-header__action {
								height: 24px;
							}
						`}
					>
						<InspectorPopoverHeader
							title={__('Cataloged at', 'surecart')}
							onClose={onClose}
							actions={[
								{
									label: __('Now', 'surecart'),
									onClick: () => {
										updateProduct({
											cataloged_at:
												Date.parse(
													getDate(new Date())
												) / 1000,
										});
									},
								},
							]}
						/>

						<DateTimePicker
							currentDate={
								product?.cataloged_at
									? getDate(product?.cataloged_at * 1000)
									: null
							}
							isInvalidDate={(date) => {
								return date > new Date();
							}}
							onChange={onChangeDate}
							is12Hour
						/>
					</div>
				)}
			/>
		</PanelRow>
	);
};

function RenderDropdownButton({ isOpen, onClick, product }) {
	return (
		<Button
			className="edit-post-post-url__toggle"
			variant="tertiary"
			aria-expanded={isOpen}
			aria-label={__('Cataloged at', 'surecart')}
			onClick={onClick}
			css={css`
				white-space: break-spaces !important;
				text-align: right;
			`}
		>
			{formatDateTime(product?.cataloged_at * 1000)}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				strokeWidth={2}
				stroke="currentColor"
				width="18"
				height="18"
				style={{
					fill: 'none',
					color: 'var(--sc-color-gray-300)',
					marginLeft: '6px',
					flex: '1 0 18px',
				}}
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
				/>
			</svg>
		</Button>
	);
}
