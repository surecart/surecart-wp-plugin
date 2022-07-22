/** @jsx jsx */
import { css, jsx, Global } from '@emotion/core';
import { sprintf, __ } from '@wordpress/i18n';
import {
	ScBlockUi,
	ScButton,
	ScDropdown,
	ScForm,
	ScFormatDate,
	ScIcon,
	ScInput,
	ScMenu,
	ScMenuItem,
	ScStackedListRow,
} from '@surecart/components-react';
import { store as noticesStore } from '@wordpress/notices';
import { useEffect, useState } from 'react';
import { useDispatch, useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { formatTime } from '../../../util/time';
import useSnackbar from '../../../hooks/useSnackbar';
import { Button, Modal } from '@wordpress/components';

export default ({ activation, onEdit }) => {
	const [openModal, setOpenModal] = useState();
	const { addSnackbarNotice } = useSnackbar();
	const { deleteEntityRecord, saveEntityRecord } = useDispatch(coreStore);
	const { createSuccessNotice, createErrorNotice } =
		useDispatch(noticesStore);

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
			addSnackbarNotice({
				content: deleteError?.message,
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
			createSuccessNotice(__('The activation was deleted.', 'surecart'), {
				type: 'snackbar',
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

	const onSaveEdits = () => {};

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
						<ScInput
							label={__('Name', 'surecart')}
							type="text"
							value={activation?.name}
						/>
						<ScInput
							label={__('Fingerprint', 'surecart')}
							required
							help={__(
								'This is a unique identifier for the license. For example, a website url.',
								'surecart'
							)}
							type="text"
							value={activation?.fingerprint}
						/>
						<ScButton type="primary" submit>
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
