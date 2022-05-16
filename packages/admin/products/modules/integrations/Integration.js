/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import {
	ScButton,
	ScDropdown,
	ScIcon,
	ScMenu,
	ScMenuItem,
} from '@surecart/components-react';
import { useState } from '@wordpress/element';

export default ({ integration: savedIntegration }) => {
	const [deleting, setDeleting] = useState(false);
	console.log({ savedIntegration });
	const { integration_id, provider, id } = savedIntegration;

	const { deleteEntityRecord } = useDispatch(coreStore);

	const { integration, loading } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'integration_provider_item',
				integration_id,
				{ context: 'edit', provider },
			];
			return {
				integration: select(coreStore).getEntityRecord(...queryArgs),
				loading: select(coreStore).isResolving(
					'getEntityRecord',
					queryArgs
				),
			};
		},
		[integration_id]
	);

	const onRemove = async () => {
		try {
			setDeleting(true);
			await deleteEntityRecord('surecart', 'integration', id);
		} catch (e) {
			console.error(e);
			setError(e?.message || __('An error occurred', 'surecart'));
		} finally {
			setDeleting(false);
		}
	};

	return (
		<sc-stacked-list-row style={{ position: 'relative' }} mobile-size={0}>
			{loading || deleting ? (
				<sc-block-ui spinner></sc-block-ui>
			) : (
				<div
					css={css`
						display: flex;
						align-items: center;
						gap: 0.75em;
						overflow: hidden;
						min-width: 0;
					`}
				>
					<div
						css={css`
							display: flex;
							align-items: center;
							justify-content: center;
							padding: 1em;
							background: var(--sc-color-gray-200);
							border-radius: var(--sc-border-radius-small);
						`}
					>
						logo
					</div>
					<div
						css={css`
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
						`}
					>
						<div
							css={css`
								overflow: hidden;
								text-overflow: ellipsis;
								white-space: nowrap;
								font-weight: bold;
							`}
						>
							{integration?.label}
						</div>
						{integration?.provider_label}
					</div>
				</div>
			)}

			<ScDropdown slot="suffix" placement="bottom-end">
				<ScButton type="text" slot="trigger" circle>
					<ScIcon name="more-horizontal" />
				</ScButton>
				<ScMenu>
					<ScMenuItem onClick={onRemove}>
						{__('Delete', 'surecart')}
					</ScMenuItem>
				</ScMenu>
			</ScDropdown>
		</sc-stacked-list-row>
	);
};
