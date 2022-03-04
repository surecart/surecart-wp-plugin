/** @jsx jsx */
import { select, useDispatch, useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { useState } from '@wordpress/element';
import { addQueryArgs } from '@wordpress/url';
import { CeButton } from '@checkout-engine/components-react';
import { __ } from '@wordpress/i18n';
import Definition from '../../ui/Definition';
import { CeFormControl } from '@checkout-engine/components-react';
import UserSelect from '../../components/UserSelect';
import { css, jsx } from '@emotion/core';

export default ({ customer_id, customer }) => {
	const [id, setId] = useState();
	const { saveEntityRecord } = useDispatch(coreStore);
	const mode = customer?.live_mode ? 'live' : 'test';

	// get user when customer id changes
	const { users, loading } = useSelect(
		(select) => {
			const queryArgs = [
				'root',
				'user',
				{ ce_customer_ids: [customer_id] },
			];
			const users = select(coreStore).getEntityRecords(...queryArgs);
			const loading = select(coreStore).isResolving(
				'getEntityRecords',
				queryArgs
			);
			return {
				users: (users || []).filter((user) => {
					return user?.meta?.ce_customer_ids?.[mode] === customer_id;
				}),
				loading,
			};
		},
		[customer_id]
	);

	const saving = useSelect(
		(select) => {
			return select(coreStore).isSavingEntityRecord('root', 'user', id);
		},
		[id]
	);

	const disconnect = (id) => {
		const r = confirm(
			__(
				'Are you sure you want to disconnect this from this customer? This will cause them to lose access to their purchases.',
				'checkout_engine'
			)
		);
		if (r) {
			setId(id);
			const user = select(coreStore).getEntityRecord(
				'root',
				'user',
				parseInt(id)
			);
			saveEntityRecord('root', 'user', {
				id,
				meta: {
					ce_customer_ids: {
						...(user?.meta?.ce_customer_ids || {}),
						...{ [mode]: '' },
					},
				},
			});
		}
	};

	const connect = (id) => {
		setId(id);
		const user = select(coreStore).getEntityRecord(
			'root',
			'user',
			parseInt(id)
		);
		saveEntityRecord('root', 'user', {
			id,
			meta: {
				ce_customer_ids: {
					...(user?.meta?.ce_customer_ids || {}),
					...{ [mode]: customer_id },
				},
			},
		});
	};

	if (loading || saving) {
		return (
			<ce-skeleton
				style={{
					width: '80%',
				}}
			></ce-skeleton>
		);
	}

	if (users?.length) {
		return users.map((user) => (
			<div>
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
					<CeButton
						href=""
						size="small"
						type="danger"
						outline
						onClick={() => disconnect(user?.id)}
					>
						{__('Disconnect', 'checkout_engine')}
					</CeButton>
				</Definition>
			</div>
		));
	}

	return (
		<div>
			<CeFormControl label={__('Connect a user', 'checkout_engine')}>
				<UserSelect
					value={users?.[0]?.id}
					onSelect={(id) => {
						if (!id) return;
						connect(id);
					}}
					required
				/>
			</CeFormControl>
		</div>
	);
};
