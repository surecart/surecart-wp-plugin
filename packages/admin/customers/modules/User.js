/** @jsx jsx */
import { select, useDispatch, useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { useState, useEffect } from '@wordpress/element';
import { addQueryArgs } from '@wordpress/url';
import { ScButton } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import Definition from '../../ui/Definition';
import { ScFormControl } from '@surecart/components-react';
import UserSelect from '../../components/UserSelect';
import { css, jsx } from '@emotion/core';

export default ({ customer_id, customer }) => {
	const [connectData, setConnectData] = useState({ id: null, action: null });
	const { saveEntityRecord } = useDispatch(coreStore);
	const mode = customer?.live_mode ? 'live' : 'test';

	// get user when customer id changes
	const { users, loading } = useSelect(
		(select) => {
			const queryArgs = [
				'root',
				'user',
				{
					sc_customer_ids: [customer_id],
					meta: { sc_customer_ids: [customer_id] },
				},
			];
			const users = select(coreStore).getEntityRecords(...queryArgs);
			const loading = select(coreStore).isResolving(
				'getEntityRecords',
				queryArgs
			);

			return {
				users,
				loading,
			};
		},
		[customer_id]
	);

	const user = useSelect(
		(select) =>
			select(coreStore).getEntityRecord(
				'root',
				'user',
				parseInt(connectData?.id)
			),
		[connectData.id]
	);

	const saving = useSelect(
		(select) => {
			return select(coreStore).isSavingEntityRecord(
				'root',
				'user',
				connectData.id
			);
		},
		[connectData.id]
	);

	const disconnect = (id) => {
		const r = confirm(
			__(
				'Are you sure you want to disconnect this from this customer? This will cause them to lose access to their purchases.',
				'surecart'
			)
		);
		if (r) {
			setConnectData({ id: parseInt(id), action: 'disconnect' });
		}
	};

	useEffect(() => {
		if (user) {
			if (connectData.action === 'connect') {
				saveEntityRecord('root', 'user', {
					id: connectData.id,
					meta: {
						sc_customer_ids: {
							...(user?.meta?.sc_customer_ids || {}),
							...{ [mode]: customer_id },
						},
					},
				});
			}
			if (connectData.action === 'disconnect') {
				saveEntityRecord('root', 'user', {
					id: connectData.id,
					meta: {
						sc_customer_ids: {
							...(user?.meta?.sc_customer_ids || {}),
							...{ [mode]: '' },
						},
					},
				});
			}
		}
	}, [connectData]);

	const connect = (id) => {
		setConnectData({ id: parseInt(id), action: 'connect' });
	};

	const filteredUsers = (users || []).filter(
		(user) =>
			user?.meta?.sc_customer_ids?.[customer?.live_mode ? 'live' : 'test']
	);

	if (loading || saving) {
		return (
			<sc-skeleton
				style={{
					width: '80%',
				}}
			></sc-skeleton>
		);
	}

	if (filteredUsers?.length) {
		return filteredUsers.map((user) => (
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
			</div>
		));
	}

	return (
		<div>
			<ScFormControl label={__('Connect a user', 'surecart')}>
				<UserSelect
					value={users?.[0]?.id}
					onSelect={(id) => {
						if (!id) return;
						connect(id);
					}}
					required
				/>
			</ScFormControl>
		</div>
	);
};
