/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { Button } from '@wordpress/components';

/**
 * Internal dependencies.
 */
import {
	ScIcon,
	ScProductLineItemNote,
	ScText,
} from '@surecart/components-react';
import LineItemNoteInput from './LineItemNoteInput';

export default function LineItemNote({ lineItem, onChange, isDraftInvoice }) {
	const [showLineItemInput, setShowLineItemInput] = useState(false);

	if (!isDraftInvoice) {
		if (!lineItem?.note) {
			return null;
		}

		return <ScProductLineItemNote note={lineItem?.note} />;
	}

	if (showLineItemInput) {
		return (
			<LineItemNoteInput
				onSave={(noteValue) => {
					onChange({ note: noteValue });
					setShowLineItemInput(false);
				}}
				onCancel={() => setShowLineItemInput(false)}
				initialValue={lineItem?.note ?? ''}
			/>
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
					onClick={() => setShowLineItemInput(true)}
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
						onClick={() => setShowLineItemInput(true)}
						label={
							!!lineItem?.note
								? __('Edit note', 'surecart')
								: __('Add note', 'surecart')
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
		</div>
	);
}
