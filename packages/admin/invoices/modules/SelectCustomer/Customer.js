/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScButton,
	ScCard,
	ScDropdown,
	ScFlex,
	ScIcon,
	ScMenu,
	ScMenuItem,
	ScSkeleton,
} from '@surecart/components-react';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import useAvatar from '../../../hooks/useAvatar';
import { store as coreStore } from '@wordpress/core-data';

export default ({ id, onChange }) => {
	const { customer, loading } = useSelect(
		(select) => {
			if (!id) {
				return {};
			}
			// our entity query data.
			const entityData = ['surecart', 'customer', id];
			return {
				customer: select(coreStore).getEntityRecord(...entityData),
				loading: !select(coreStore)?.hasFinishedResolution?.(
					'getEntityRecord',
					[...entityData]
				),
			};
		},
		[id]
	);

	const avatarUrl = useAvatar({ email: customer?.email });

	if (loading) {
		return <ScSkeleton />;
	}

	return (
		<ScCard>
			<ScFlex alignItems="center" justifyContent="space-between">
				<ScFlex alignItems="center" justifyContent="flex-start">
					<div>
						<img
							src={avatarUrl || ''}
							css={css`
								width: 36px;
								height: 36px;
								border-radius: var(--sc-border-radius-medium);
							`}
						/>
					</div>
					<div>
						<div>{customer?.name}</div>
						<div>{customer?.email}</div>
					</div>
				</ScFlex>

				<ScDropdown placement="bottom-end">
					<ScButton type="text" slot="trigger" circle>
						<ScIcon name="more-horizontal" />
					</ScButton>
					<ScMenu>
						<ScMenuItem onClick={() => onChange(null)}>
							<ScIcon
								slot="prefix"
								name="trash"
								style={{
									opacity: 0.5,
								}}
							/>
							{__('Remove', 'surecart')}
						</ScMenuItem>
					</ScMenu>
				</ScDropdown>
			</ScFlex>
		</ScCard>
	);
};
