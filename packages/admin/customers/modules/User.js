/** @jsx jsx */
import { useDispatch, useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { useState } from '@wordpress/element';
import { addQueryArgs } from '@wordpress/url';
import { CeButton } from '@checkout-engine/components-react';
import { __ } from '@wordpress/i18n';
import Definition from '../../ui/Definition';
import { CeFormControl } from '@checkout-engine/components-react';
import UserSelect from '../../components/UserSelect';
import { css, jsx } from '@emotion/core';

export default ({ customer_id }) => {
	const [id, setId] = useState();
	const { saveEntityRecord } = useDispatch(coreStore);

	// get user when customer id changes
	const { user, loading } = useSelect(
		(select) => {
			const queryArgs = ['root', 'user', { ce_customer_id: customer_id }];
			const users = select(coreStore).getEntityRecords(...queryArgs);
			const loading = select(coreStore).isResolving(
				'getEntityRecords',
				queryArgs
			);
			return {
				user: (users || []).find(
					(user) => user?.meta?.ce_customer_id === customer_id
				),
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
			saveEntityRecord('root', 'user', {
				id,
				meta: {
					ce_customer_id: '',
				},
			});
		}
	};

	const connect = (id) => {
		setId(id);
		saveEntityRecord('root', 'user', {
			id,
			meta: {
				ce_customer_id: customer_id,
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

	if (user) {
		return (
			<div>
				<Definition
					title={
						<div>
							{user?.avatar_urls?.[96] && (
								<img
									css={css`
										width: 24px;
										height: 24px;
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
						onClick={() => disconnect(user?.id)}
					>
						{__('Disconnect', 'checkout_engine')}
					</CeButton>
				</Definition>
			</div>
		);
	}

	return (
		<div>
			<CeFormControl label={__('Connect a user', 'checkout_engine')}>
				<UserSelect
					value={user?.id}
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
