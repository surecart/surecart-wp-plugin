/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ScButton, ScFormControl } from '@surecart/components-react';
import { store as coreStore } from '@wordpress/core-data';
import { select, useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';
import { addQueryArgs } from '@wordpress/url';
import { useState } from 'react';

import UserSelect from '../../../components/UserSelect';
import Box from '../../../ui/Box';
import Definition from '../../../ui/Definition';

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
			if (!customer?.id) {
				return {
					user: null,
					loading: true,
				};
			}

			const queryArgs = [
				'root',
				'user',
				{
					sc_customer_ids: [customer?.id],
					meta: { sc_customer_ids: [customer?.id] },
				},
			];

			return {
				user: (
					select(coreStore).getEntityRecords(...queryArgs) || []
				).find(
					(user) =>
						user?.meta?.sc_customer_ids?.[
							customer?.live_mode ? 'live' : 'test'
						]
				),
				loading: select(coreStore).isResolving(
					'getEntityRecords',
					queryArgs
				),
			};
		},
		[customer?.id]
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
		if (!userId) {
			return;
		}

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
					<UserSelect onSelect={connect} value={user?.id} required />
				</ScFormControl>
			)}
		</Box>
	);
};
