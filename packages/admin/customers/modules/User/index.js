/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { select, useDispatch, useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
import { __ } from '@wordpress/i18n';
import { ScButton, ScFormControl } from '@surecart/components-react';
import { addQueryArgs } from '@wordpress/url';
import UserSelect from '../../../components/UserSelect';
import Box from '../../../ui/Box';
import Definition from '../../../ui/Definition';
import { useState } from 'react';

export default ({ customerId, customer }) => {
	const { createErrorNotice, createSuccessNotice } =
		useDispatch(noticesStore);
	const { saveEntityRecord } = useDispatch(coreStore);
	const [saving, setSaving] = useState(false);
	const mode = customer?.live_mode ? 'live' : 'test';

	const handleError = (e) => {
		createErrorNotice(
			e?.message || __('Something went wrong', 'surecart'),
			{ type: 'snackbar' }
		);
		e?.additional_errors.forEach((e) => {
			createErrorNotice(e?.message, {
				type: 'snackbar',
			});
		});
	};

	// get user when customer id changes
	const { user, loading } = useSelect(
		(select) => {
			const queryArgs = [
				'root',
				'user',
				{
					sc_customer_ids: [customerId],
					meta: { sc_customer_ids: [customerId] },
				},
			];
			return {
				user: (select(coreStore).getEntityRecords(...queryArgs) ||
					[])?.[0],
				loading: select(coreStore).isResolving(
					'getEntityRecords',
					queryArgs
				),
			};
		},
		[customerId]
	);

	/** Disconnect a WordPress user */
	const disconnect = async (userId) => {
		const r = confirm(
			__(
				'Are you sure you want to disconnect this from this customer? This will cause them to lose access to their purchases.',
				'surecart'
			)
		);
		if (!r) return;

		setSaving(true);
		const id = parseInt(userId);

		const user = await select(coreStore).getEntityRecord(
			'root',
			'user',
			id
		);

		try {
			await saveEntityRecord(
				'root',
				'user',
				{
					id,
					meta: {
						sc_customer_ids: {
							...(user?.meta?.sc_customer_ids || {}),
							...{ [mode]: '' },
						},
					},
				},
				{ throwOnError: true }
			);
			createSuccessNotice(__('User disconnected.', 'surecart'), {
				type: 'snackbar',
			});
		} catch (e) {
			handleError(e);
		} finally {
			setSaving(false);
		}
	};

	/** Connect a WordPress user */
	const connect = async (userId) => {
		const id = parseInt(userId);
		setSaving(true);
		try {
			const user = await select(coreStore).getEntityRecord(
				'root',
				'user',
				id
			);

			await saveEntityRecord('root', 'user', {
				id,
				meta: {
					sc_customer_ids: {
						...(user?.meta?.sc_customer_ids || {}),
						...{ [mode]: customerId },
					},
				},
			});
			createSuccessNotice(__('User connected.', 'surecart'), {
				type: 'snackbar',
			});
		} catch (e) {
			handleError(e);
		} finally {
			setSaving(false);
		}
	};

	return (
		<Box
			title={__('WordPress User', 'surecart')}
			loading={loading || saving}
		>
			{user?.id ? (
				<Definition
					title={
						<div>
							{user?.avatar_urls?.[96] && (
								<img
									css={css`
										width: 48px;
										height: 48px;
										border-radius: 9999px;
									`}
									src={user?.avatar_urls?.[96]}
								/>
							)}
							<div>
								<a
									href={addQueryArgs('user-edit.php', {
										user_id: user?.id,
									})}
								>
									{user?.name || user?.email}
								</a>
							</div>
							{user?.name && user?.email && (
								<div
									css={css`
										overflow: hidden;
										white-space: nowrap;
										text-overflow: ellipsis;
										max-width: 235px;
									`}
								>
									{user?.email}
								</div>
							)}
						</div>
					}
				>
					<ScButton
						href=""
						size="small"
						type="danger"
						outline
						onClick={() => disconnect(user?.id)}
					>
						{__('Disconnect', 'surecart')}
					</ScButton>
				</Definition>
			) : (
				<ScFormControl label={__('Connect a user', 'surecart')}>
					<UserSelect onSelect={connect} required />
				</ScFormControl>
			)}
		</Box>
	);
};
