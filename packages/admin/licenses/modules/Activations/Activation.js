/** @jsx jsx */
import { css, Global, jsx } from '@emotion/core';
import { ScAlert, ScBlockUi, ScButton, ScDropdown, ScForm, ScIcon, ScInput, ScMenu, ScMenuItem, ScStackedListRow } from '@surecart/components-react';
import { Modal } from '@wordpress/components';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';
import { useEffect, useState } from 'react';

import { formatTime } from '../../../util/time';

export default ({ activation }) => {
	const [openModal, setOpenModal] = useState();
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState(false);
	const [activationState, setActivationState] = useState(activation);
	const { deleteEntityRecord, saveEntityRecord } = useDispatch(coreStore);
	const { createSuccessNotice, createErrorNotice } =
		useDispatch(noticesStore);

	useEffect(() => {
		setActivationState(activation);
	}, [activation]);

	const { isDeleting, deleteError } = useSelect((select) => ({
		isDeleting: select(coreStore).isDeletingEntityRecord(
			'surecart',
			'activation',
			activation?.id
		),
		deleteError: select(coreStore).getLastEntityDeleteError(
			'surecart',
			'activation',
			activation?.id
		),
	}));

	useEffect(() => {
		if (deleteError) {
			createErrorNotice(deleteError?.message, {
				type: 'snackbar',
			});
		}
	}, [deleteError]);

	const onDelete = async () => {
		// confirm.
		const r = confirm(
			__(
				'Are you sure you want to remove this activation? This site will no longer get updates.',
				'surecart'
			)
		);
		if (!r) return;

		// delete.
		const success = await deleteEntityRecord(
			'surecart',
			'activation',
			activation?.id
		);

		// notice.
		if (success) {
			createSuccessNotice(__('Activation deleted.', 'surecart'), {
				type: 'snackbar',
				explicitDismiss: true,
			});
			return;
		}

		createErrorNotice(
			`${deleteError?.message || 'There was an error.'} ${__(
				'Please refresh the page and try again.',
				'surecart'
			)}`,
			{
				type: 'snackbar',
			}
		);
	};

	const onSaveEdits = async () => {
		try {
			setBusy(true);
			setError(false);
			await saveEntityRecord('surecart', 'activation', activationState, {
				throwOnError: true,
			});
			createSuccessNotice(__('Activation updated.', 'surecart'), {
				type: 'snackbar',
				explicitDismiss: true,
			});
			setOpenModal(false);
		} catch (e) {
			setError(e?.message || __('Something went wrong.', 'surecart'));
		} finally {
			setBusy(false);
		}
	};

	return (
		<>
			<Global
				styles={css`
					.sc-modal-overflow {
						box-sizing: border-box;
						.components-modal__content,
						.components-modal__frame {
							/* overflow: visible !important; */
							box-sizing: border-box;
							max-width: 600px !important;
							width: 100%;
						}
						.components-modal__frame {
							overflow: visible !important;
						}
					}
				`}
			/>

			{isDeleting && <ScBlockUi spinner />}

			{openModal && (
				<Modal
					title={__('Edit Activation', 'surecart')}
					css={css`
						width: 100%;
						box-sizing: border-box;
					`}
					overlayClassName={'sc-modal-overflow'}
					onRequestClose={() => setOpenModal(false)}
					shouldCloseOnClickOutside={false}
				>
					<ScForm onScSubmit={onSaveEdits}>
						{!!error && <ScAlert type="danger">{error}</ScAlert>}
						<ScInput
							label={__('Name', 'surecart')}
							type="text"
							value={activationState?.name}
							onScInput={(e) =>
								setActivationState({
									...activationState,
									...{ name: e.target.value },
								})
							}
						/>
						<ScInput
							label={__('Fingerprint', 'surecart')}
							required
							help={__(
								'This is a unique identifier for the license. For example, a website url.',
								'surecart'
							)}
							type="text"
							value={activationState?.fingerprint}
							onScInput={(e) =>
								setActivationState({
									...activationState,
									...{ fingerprint: e.target.value },
								})
							}
						/>
						<ScButton
							type="primary"
							busy={busy}
							disabled={busy}
							submit
						>
							{__('Update', 'surecart')}
						</ScButton>
					</ScForm>
				</Modal>
			)}

			<ScStackedListRow style={{ '--columns': '2' }}>
				<div>
					<div>
						<strong>{activation?.name}</strong>
					</div>
					<div>{activation?.fingerprint}</div>
				</div>

				<div>
					<strong>
						{formatTime(activation?.created_at, {
							dateStyle: 'medium',
							timeZone: 'UTC',
						})}
					</strong>
					<br />
					{formatTime(activation?.created_at, {
						timeStyle: 'medium',
						timeZone: 'UTC',
					})}
				</div>

				<ScDropdown slot="suffix" placement="bottom-end">
					<ScButton type="text" slot="trigger" circle>
						<ScIcon name="more-horizontal"></ScIcon>
					</ScButton>
					<ScMenu>
						<ScMenuItem onClick={() => setOpenModal(true)}>
							<ScIcon slot="prefix" name="edit" />
							{__('Edit', 'surecart')}
						</ScMenuItem>
						<ScMenuItem onClick={onDelete}>
							<ScIcon slot="prefix" name="trash" />
							{__('Delete', 'surecart')}
						</ScMenuItem>
					</ScMenu>
				</ScDropdown>
			</ScStackedListRow>
		</>
	);
};
