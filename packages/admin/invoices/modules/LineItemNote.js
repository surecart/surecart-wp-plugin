/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { Tooltip } from '@wordpress/components';

/**
 * Internal dependencies.
 */
import {
	ScButton,
	ScProductLineItemNote,
	ScText,
	ScTextarea,
} from '@surecart/components-react';

export default function LineItemNote({ lineItem, onChange, isDraftInvoice }) {
	const [editing, setEditing] = useState(false);
	const [value, setValue] = useState(lineItem?.note ?? '');

	useEffect(() => setValue(lineItem?.note ?? ''), [lineItem?.note]);

	if (!isDraftInvoice)
		return <ScProductLineItemNote note={lineItem?.note ?? ''} />;

	return (
		<div
			css={css`
				min-height: 2em;
				display: flex;
				align-items: center;
			`}
		>
			{editing ? (
				<div
					css={css`
						display: flex;
						flex-direction: column;
						gap: 0.5em;
						width: 100%;
					`}
				>
					<ScTextarea
						autofocus
						value={value}
						placeholder={__('Add a note...', 'surecart')}
						onScInput={(e) => setValue(e.target.value)}
						rows="2"
						css={css`
							font-size: 12px;
						`}
					/>
					<div
						css={css`
							display: flex;
							gap: 0.25em;
						`}
					>
						<ScButton
							size="small"
							type="primary"
							onClick={() => {
								setEditing(false);
								onChange({ note: value });
							}}
						>
							{__('Save', 'surecart')}
						</ScButton>
						<ScButton
							size="small"
							type="text"
							onClick={() => {
								setEditing(false);
								setValue(lineItem?.note ?? '');
							}}
						>
							{__('Cancel', 'surecart')}
						</ScButton>
					</div>
				</div>
			) : (
				<Tooltip
					text={
						!!value
							? __('Click to edit note', 'surecart')
							: __('Click to add note', 'surecart')
					}
				>
					<button
						css={css`
							cursor: pointer;
							width: 100%;
							min-height: 2em;
							display: flex;
							align-items: center;
							padding: 0.25em;
							border-radius: 4px;
							border: none;
							background: transparent;
							text-align: left;
							&:hover {
								background-color: var(--sc-color-gray-50);
							}
							&:focus {
								outline: 2px solid var(--sc-color-primary-500);
								outline-offset: 2px;
							}
						`}
						onClick={() => setEditing(true)}
						aria-label={
							lineItem?.note
								? __('Edit note', 'surecart')
								: __('Add note', 'surecart')
						}
						type="button"
					>
						<ScText
							css={css`
								font-size: 12px;
								${lineItem?.note
									? `line-height: 1.3; color: var(--sc-input-color); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis;`
									: `color: var(--sc-input-placeholder-color); font-style: italic;`}
							`}
						>
							{lineItem?.note ||
								__('Add note (optional)', 'surecart')}
						</ScText>
					</button>
				</Tooltip>
			)}
		</div>
	);
}
