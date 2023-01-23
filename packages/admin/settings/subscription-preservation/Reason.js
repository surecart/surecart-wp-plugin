/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScBlockUi,
	ScButton,
	ScDropdown,
	ScIcon,
	ScMenu,
	ScMenuItem,
	ScSkeleton,
	ScStackedListRow,
	ScTag,
} from '@surecart/components-react';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
import { useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { useState } from 'react';
import EditReason from './EditReason';

export default ({ reason, loading }) => {
	const [edit, setEdit] = useState(null);
	const [busy, setBusy] = useState(false);
	const { deleteEntityRecord } = useDispatch(coreStore);
	const { createErrorNotice } = useDispatch(noticesStore);

	const onDelete = async () => {
		const r = confirm(
			__('Are you sure you want to delete this?', 'surecart')
		);
		if (!r) return;
		try {
			setBusy(true);
			await deleteEntityRecord(
				'surecart',
				'cancellation_reason',
				reason?.id,
				undefined,
				{ throwOnError: true }
			);
		} catch (e) {
			createErrorNotice(
				e?.message || __('Something went wrong', 'surecart'),
				{
					type: 'snackbar',
				}
			);
		} finally {
			setBusy(false);
		}
	};

	return (
		<>
			<ScStackedListRow
				style={{
					'--columns': '2',
				}}
			>
				{loading ? (
					<ScSkeleton style={{ width: '150px' }} />
				) : (
					<div>
						<strong>{reason?.label}</strong>{' '}
						{reason?.coupon_enabled && (
							<ScTag type="info" size="small">
								{__('Discount', 'surecart')}
							</ScTag>
						)}
					</div>
				)}

				<ScIcon
					class="dragger"
					name="menu"
					slot="prefix"
					css={css`
						color: var(--sc-color-gray-400);
						cursor: move;
					`}
				/>

				<ScDropdown
					class="dropdown"
					slot="suffix"
					placement="bottom-end"
				>
					<ScButton type="text" slot="trigger" circle>
						<ScIcon name="more-horizontal" />
					</ScButton>
					<ScMenu>
						<ScMenuItem onClick={() => setEdit(reason)}>
							<ScIcon
								name="edit-2"
								slot="prefix"
								style={{ opacity: 0.5 }}
							/>
							{__('Edit', 'surecart')}
						</ScMenuItem>
						<ScMenuItem onClick={onDelete}>
							<ScIcon
								name="trash"
								slot="prefix"
								style={{ opacity: 0.5 }}
							/>
							{__('Delete', 'surecart')}
						</ScMenuItem>
					</ScMenu>
				</ScDropdown>
				{!!edit && (
					<EditReason
						reason={edit}
						onRequestClose={() => setEdit(null)}
					/>
				)}
			</ScStackedListRow>
			{busy && <ScBlockUi spinner />}
		</>
	);
};
