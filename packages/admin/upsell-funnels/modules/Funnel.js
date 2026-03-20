/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __, sprintf } from '@wordpress/i18n';
import Box from '../../ui/Box';
import { useState } from '@wordpress/element';
import Upsell from './Upsell';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch } from '@wordpress/data';
import EditUpsell from './Upsell/EditUpsell';
import { __experimentalConfirmDialog as ConfirmDialog } from '@wordpress/components';
import { createErrorString } from '../../util';
import { ScBlockUi } from '@surecart/components-react';

export default ({ funnelId, upsells, loading }) => {
	const { saveEntityRecord, deleteEntityRecord } = useDispatch(coreStore);
	const [editUpsell, setEditUpsell] = useState(false);
	const [deleteUpsell, setDeleteUpsell] = useState(false);
	const [busy, setBusy] = useState(false);

	const onDelete = async (upsell) => {
		try {
			setBusy(true);
			await deleteEntityRecord('surecart', 'upsell', upsell.id, {
				throwOnError: true,
			});
			setDeleteUpsell(false);
		} catch (e) {
			console.error(e);
			createErrorNotice(createErrorString(e), {
				type: 'snackbar',
			});
		} finally {
			setBusy(false);
		}
	};

	const onCreate = (data) => {
		saveEntityRecord('surecart', 'upsell', {
			...data,
			fee_description: __('Offer', 'surecart'),
			upsell_funnel: funnelId,
		});
	};

	const { initial, accepted, declined } = (upsells || []).reduce(
		(acc, upsell) => {
			acc[upsell?.step] = upsell;
			return acc;
		},
		{}
	);

	return (
		<>
			<Box
				title={__('Post Purchase Offer', 'surecart')}
				loading={loading && !upsells?.length}
			>
				<Upsell
					label={__('Upsell Offer #1', 'surecart')}
					icon="gift"
					upsell={initial}
					loading={loading}
					onEdit={() =>
						setEditUpsell({ ...initial, step: 'initial' })
					}
					onDelete={() => setDeleteUpsell(initial)}
				/>
				<div
					css={css`
						display: flex;
						flex-wrap: wrap;
						gap: 1em;
						align-items: flex-start;
					`}
				>
					<Upsell
						label={__('Upsell Offer #2', 'surecart')}
						help={__('Optional', 'surecart')}
						icon="trending-up"
						upsell={accepted}
						onEdit={() =>
							setEditUpsell({ ...accepted, step: 'accepted' })
						}
						onDelete={() => setDeleteUpsell(accepted)}
						css={css`
							flex: 1;
							position: relative;
							min-width: 100px;
							margin-top: 60px;
							z-index: 1;
							&:before {
								content: ' ';
								position: absolute;
								left: 50%;
								top: -75px; /* Adjust this value to position the line above the div */
								height: 75px; /* Height of the vertical line */
								width: 1px; /* Width of the vertical line */
								background-color: rgba(
									0,
									0,
									0,
									0.2
								); /* Color of the line */
								transform: translateX(-50%);
								z-index: 0;
							}
							&:after {
								content: '${__('if accepted', 'surecart')}';
								position: absolute;
								left: 50%;
								top: -56px; /* Adjust this value to position the line above the div */
								transform: translateX(-50%);
								border: 1px solid var(--sc-color-success-600);
								color: var(--sc-color-success-600);
								padding: 10px;
								background: white;
								z-index: 0;
								line-height: 1;
								font-size: 12px;
								border-radius: 6px;
							}
						`}
					/>
					<Upsell
						label={__('Downsell Offer', 'surecart')}
						help={__('(Optional)', 'surecart')}
						icon="trending-down"
						upsell={declined}
						onEdit={() =>
							setEditUpsell({ ...declined, step: 'declined' })
						}
						onDelete={() => setDeleteUpsell(declined)}
						css={css`
							flex: 1;
							position: relative;
							min-width: 100px;
							margin-top: 60px;
							&:before {
								content: ' ';
								position: absolute;
								left: 50%;
								top: -75px; /* Adjust this value to position the line above the div */
								height: 75px; /* Height of the vertical line */
								width: 1px; /* Width of the vertical line */
								background-color: rgba(
									0,
									0,
									0,
									0.2
								); /* Color of the line */
								transform: translateX(-50%);
								z-index: 0;
							}
							&:after {
								content: '${__('if declined', 'surecart')}';
								position: absolute;
								left: 50%;
								top: -56px; /* Adjust this value to position the line above the div */
								transform: translateX(-50%);
								border: 1px solid var(--sc-color-danger-500);
								color: var(--sc-color-danger-500);
								padding: 10px;
								background: white;
								z-index: 0;
								line-height: 1;
								font-size: 12px;
								border-radius: 6px;
							}
						`}
					/>
				</div>
				{(busy || (loading && upsells?.length)) && (
					<ScBlockUi spinner />
				)}
			</Box>
			{!!editUpsell && (
				<EditUpsell
					open={!!editUpsell}
					upsell={{ ...editUpsell, upsell_funnel: funnelId }}
					onCreate={onCreate}
					onRequestClose={() => setEditUpsell(false)}
				/>
			)}

			<ConfirmDialog
				isOpen={deleteUpsell}
				onConfirm={() => onDelete(deleteUpsell)}
				onCancel={() => setDeleteUpsell(false)}
			>
				{sprintf(
					__(
						'Are you sure? This action cannot be undone.',
						'surecart'
					)
				)}
			</ConfirmDialog>
		</>
	);
};
