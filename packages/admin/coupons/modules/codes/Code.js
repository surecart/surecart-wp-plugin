/** @jsx jsx */
import { __ } from '@wordpress/i18n';
import {
	ScInput,
	ScButton,
	ScDropdown,
	ScMenu,
	ScMenuItem,
	ScTag,
	ScBlockUi,
	ScFlex,
} from '@surecart/components-react';
import { Icon, box, trash, moreHorizontalMobile } from '@wordpress/icons';
import { css, jsx } from '@emotion/core';
import { useDispatch, useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
import { Modal } from '@wordpress/components';
import { useState } from 'react';

export default ({ promotion: { id }, index }) => {
	const [modal, setModal] = useState(false);
	const { editEntityRecord, saveEntityRecord, deleteEntityRecord } =
		useDispatch(coreStore);
	const { createErrorNotice, createSuccessNotice } =
		useDispatch(noticesStore);

	const updatePromotion = (data) =>
		editEntityRecord('surecart', 'promotion', id, data);

	const deletePromotion = async () => {
		try {
			await deleteEntityRecord('surecart', 'promotion', id, {
				throwOnError: true,
			});
			createSuccessNotice(__('Deleted.', 'surecart'), {
				type: 'snackbar',
			});
			setModal(false);
		} catch (e) {
			console.error(e);
			createErrorNotice(
				e?.message || __('Something went wrong', 'surecart')
			);
		}
	};

	const onArchive = async () => {
		try {
			const saved = await saveEntityRecord('surecart', 'promotion', {
				id,
				archived: !promotion?.archived,
			});
			createSuccessNotice(
				saved?.archived
					? __('Archived.', 'surecart')
					: __('Restored.', 'surecart'),
				{
					type: 'snackbar',
				}
			);
		} catch (e) {
			console.error(e);
		}
	};

	const { promotion, isSaving, isDeleting } = useSelect(
		(select) => {
			if (!id) return;
			const entityData = ['surecart', 'promotion', id];
			return {
				promotion: select(coreStore).getEditedEntityRecord(
					...entityData
				),
				isLoading: select(coreStore)?.isResolving?.(
					'getEditedEntityRecord',
					[...entityData]
				),
				isSaving: select(coreStore)?.isSavingEntityRecord?.(
					...entityData
				),
				isDeleting: select(coreStore)?.isDeletingEntityRecord?.(
					...entityData
				),
			};
		},
		[id]
	);

	return (
		<div
			css={css`
				display: flex;
				justify-content: space-between;
				gap: 1em;
			`}
		>
			<div
				css={css`
					flex: 1;
					display: flex;
					gap: 1em;
				`}
			>
				<ScInput
					className="sc-promotion-code"
					css={css`
						flex: 1;
					`}
					help={
						promotion?.id
							? __(
									'Customers will enter this discount code at checkout.',
									'surecart'
							  )
							: __(
									'Customers will enter this discount code at checkout. Leave this blank and we will generate one for you.',
									'surecart'
							  )
					}
					attribute="name"
					value={promotion?.code}
					onScInput={(e) => updatePromotion({ code: e.target.value })}
				>
					{promotion?.archived && (
						<ScTag type="warning" slot="suffix">
							{__('Archived', 'surecart')}
						</ScTag>
					)}
				</ScInput>
			</div>
			<ScDropdown slot="suffix" position="bottom-right">
				<ScButton type="text" slot="trigger" circle>
					<Icon icon={moreHorizontalMobile} />
				</ScButton>
				<ScMenu>
					{promotion?.id && (
						<ScMenuItem onClick={() => onArchive(index)}>
							<Icon
								slot="prefix"
								style={{
									opacity: 0.5,
								}}
								icon={box}
								size={20}
							/>
							{promotion?.archived
								? __('Un-Archive', 'surecart')
								: __('Archive', 'surecart')}
						</ScMenuItem>
					)}
					<ScMenuItem onClick={() => setModal('delete')}>
						<Icon
							slot="prefix"
							style={{
								opacity: 0.5,
							}}
							icon={trash}
							size={20}
						/>
						{__('Delete', 'surecart')}
					</ScMenuItem>
				</ScMenu>
			</ScDropdown>
			{isSaving && (
				<ScBlockUi
					style={{ '--sc-block-ui-opacity': '0.25' }}
					spinner
				/>
			)}
			{modal === 'delete' && (
				<Modal
					title={__('Delete this promotion code?', 'surecart')}
					css={css`
						max-width: 500px !important;
					`}
					onRequestClose={() => setModal(false)}
					shouldCloseOnClickOutside={false}
				>
					<p>
						{__(
							'Are you sure you want to delete this promotion code?',
							'surecart'
						)}
					</p>
					<ScFlex alignItems="center">
						<ScButton
							type="primary"
							busy={isDeleting}
							onClick={deletePromotion}
						>
							{__('Delete', 'surecart')}
						</ScButton>
						<ScButton type="text" onClick={() => setModal(false)}>
							{__('Cancel', 'surecart')}
						</ScButton>
					</ScFlex>
				</Modal>
			)}
		</div>
	);
};
