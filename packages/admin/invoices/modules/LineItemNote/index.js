/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useState, useRef, useEffect } from '@wordpress/element';
import { Button, Icon, Tooltip } from '@wordpress/components';

/**
 * Internal dependencies.
 */
import {
	ScButton,
	ScIcon,
	ScProductLineItemNote,
	ScText,
} from '@surecart/components-react';
import LineItemNoteModal from './LineItemNoteModal';
import { chevronDown, chevronUp } from '@wordpress/icons';

export default function LineItemNote({ lineItem, onChange, isDraftInvoice }) {
	const [showModal, setShowModal] = useState(false);

	const handleSaveNote = (noteValue) => {
		onChange({ note: noteValue });
		setShowModal(false);
	};

	const [noteExpanded, setNoteExpanded] = useState(false);
	const [isTruncated, setIsTruncated] = useState(false);
	const textRef = useRef(null);

	// Check if text is truncated
	useEffect(() => {
		if (textRef.current && lineItem?.note) {
			const element = textRef.current;

			const checkTruncation = () => {
				const isOverflowing =
					element.scrollHeight > element.clientHeight;
				setIsTruncated(isOverflowing);
			};

			// Check immediately and after a small delay
			checkTruncation();
			const timer = setTimeout(checkTruncation, 50);

			return () => clearTimeout(timer);
		} else {
			setIsTruncated(false);
		}
	}, [lineItem?.note, noteExpanded, isDraftInvoice]);

	if (!isDraftInvoice) {
		if (!lineItem?.note) {
			return null;
		}

		return (
			<div
				css={css`
					display: flex;
					align-items: flex-start;
					gap: 0.25em;
					min-height: 1.5em;
				`}
			>
				<ScText
					ref={textRef}
					css={css`
						font-size: 12px;
						line-height: 1.4;
						color: var(--sc-color-gray-500);
						flex: 1;
						${!noteExpanded
							? `display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis;`
							: ``}
					`}
				>
					{lineItem?.note}
				</ScText>

				{(isTruncated || noteExpanded) && (
					<Button
						variant="link"
						onClick={() => setNoteExpanded(!noteExpanded)}
						title={
							noteExpanded
								? __('Collapse note', 'surecart')
								: __('Expand note', 'surecart')
						}
						style={{
							color: 'var(--sc-color-gray-500)',
						}}
					>
						<Icon
							icon={noteExpanded ? chevronUp : chevronDown}
							size={16}
						/>
					</Button>
				)}
			</div>
		);
	}

	return (
		<div
			css={css`
				min-height: 2em;
				display: flex;
				align-items: center;
			`}
		>
			<ScText
				css={css`
					font-size: 12px;
					${lineItem?.note
						? `line-height: 1.4; color: var(--sc-input-help-text-color); display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; border-bottom: 1px solid var(--sc-color-gray-200); padding: 4px 0px;`
						: `color: var(--sc-input-placeholder-color);`}
				`}
			>
				{lineItem?.note}
			</ScText>

			{!lineItem?.note && (
				<Button
					variant="tertiary"
					style={{
						fontSize: 12,
						color: 'var(--sc-input-placeholder-color)',
						padding: 0,
					}}
					onClick={() => setShowModal(true)}
				>
					{__('Add note (optional)', 'surecart')}
				</Button>
			)}

			{!!lineItem?.note && (
				<div
					css={css`
						width: 30px;
					`}
				>
					<Button
						variant="tertiary"
						onClick={() => setShowModal(true)}
						label={
							!!lineItem?.note
								? __('Click to edit note', 'surecart')
								: __('Click to add note', 'surecart')
						}
						style={{
							color: 'var(--sc-color-gray-500)',
						}}
					>
						<ScIcon
							name="edit-3"
							style={{
								width: 14,
								height: 14,
							}}
						/>
					</Button>
				</div>
			)}

			{showModal && (
				<LineItemNoteModal
					add={!lineItem?.note}
					setModal={setShowModal}
					onSaveNote={handleSaveNote}
					initialValue={lineItem?.note ?? ''}
				/>
			)}
		</div>
	);
}
