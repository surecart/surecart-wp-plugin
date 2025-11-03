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
	DatePicker,
} from '@wordpress/components';
import { __experimentalInspectorPopoverHeader as InspectorPopoverHeader } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { getDate } from '@wordpress/date';
import { formatDateTime } from '../../util/time';

export default ({
	currentDate,
	setDate,
	label,
	required,
	showLabel = true,
	className,
	renderButton = false,
	placeholder = null,
	dateTime = true,
}) => {
	// Use internal state instead of a ref to make sure that the component
	// re-renders when the popover's anchor updates.
	const [popoverAnchor, setPopoverAnchor] = useState(null);
	// Memoize popoverProps to avoid returning a new object every time.
	const popoverProps = useMemo(
		() => ({ anchor: popoverAnchor, placement: 'bottom-end' }),
		[popoverAnchor]
	);

	const onChangeDate = (date) => {
		date = getDate(date);

		setDate(Date.parse(date?.toUTCString()) / 1000);
	};

	return (
		<PanelRow ref={setPopoverAnchor} className={className}>
			{(showLabel || required) && (
				<div>
					{showLabel && (
						<span>{label || __('Select Date', 'surecart')}</span>
					)}
					{showLabel && required && (
						<span aria-hidden="true" className="required">
							{' '}
							*
						</span>
					)}
				</div>
			)}
			<Dropdown
				popoverProps={popoverProps}
				focusOnMount
				renderToggle={({ isOpen, onToggle }) =>
					renderButton ? (
						renderButton({
							isOpen,
							onToggle,
							date: currentDate,
							label,
						})
					) : (
						<RenderDropdownButton
							isOpen={isOpen}
							onClick={onToggle}
							date={currentDate}
							label={label || __('Select Date', 'surecart')}
							placeholder={placeholder}
						/>
					)
				}
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
							title={
								showLabel
									? label || __('Select Date', 'surecart')
									: ''
							}
							onClose={onClose}
							actions={[
								{
									label: __('Now', 'surecart'),
									onClick: () => {
										setDate(
											Date.parse(getDate(new Date())) /
												1000
										);
									},
								},
								{
									label: __('Reset', 'surecart'),
									onClick: () => {
										setDate(null);
									},
								},
							]}
						/>
						{dateTime ? (
							<DateTimePicker
								currentDate={
									currentDate
										? getDate(currentDate * 1000)
										: null
								}
								onChange={onChangeDate}
								is12Hour
							/>
						) : (
							<DatePicker
								currentDate={
									currentDate
										? getDate(currentDate * 1000)
										: null
								}
								onChange={onChangeDate}
							/>
						)}
					</div>
				)}
			/>
		</PanelRow>
	);
};

function RenderDropdownButton({ isOpen, onClick, date, label, placeholder }) {
	return (
		<Button
			className="edit-post-post-url__toggle"
			variant="tertiary"
			aria-expanded={isOpen}
			aria-label={label || __('Select Date', 'surecart')}
			onClick={onClick}
			css={css`
				white-space: break-spaces !important;
				text-align: right;
			`}
		>
			{date
				? formatDateTime(date * 1000)
				: placeholder
				? placeholder
				: __('Set Date', 'surecart')}
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
