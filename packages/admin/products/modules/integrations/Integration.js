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

export default ({ integration }) => {
	const [deleting, setDeleting] = useState(false);
	const { integration_id, provider, id } = integration;

	const { deleteEntityRecord } = useDispatch(coreStore);

	const { providerData, loading } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'integration_provider',
				provider,
				{ context: 'edit', id: integration_id },
			];
			return {
				providerData: select(coreStore).getEntityRecord(...queryArgs),
				loading: select(coreStore).isResolving(
					'getEntityRecord',
					queryArgs
				),
			};
		},
		[integration_id]
	);

	const { integrationData, loadingIntegrationData } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'integration_provider_item',
				integration_id,
				{ context: 'edit', provider },
			];
			return {
				integrationData: select(coreStore).getEntityRecord(
					...queryArgs
				),
				loadingIntegrationData: select(coreStore).isResolving(
					'getEntityRecord',
					queryArgs
				),
			};
		},
		[integration_id]
	);

	const onRemove = async () => {
		const r = confirm(
			__(
				'Are you sure you want to remove this integration? This will affect existing customers who have purchased this product.',
				'surecart'
			)
		);
		if (!r) return;
		try {
			setDeleting(true);
			await deleteEntityRecord('surecart', 'integration', id, {
				throwOnError: true,
			});
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
						`}
					>
						{providerData?.logo ? (
							<img
								src={providerData?.logo}
								css={css`
									width: 35px;
									height: 35px;
									object-fit: contain;
								`}
							/>
						) : (
							<div
								css={css`
									padding: 1em;
									width: 35px;
									box-sizing: border-box;
									height: 35px;
									display: flex;
									align-items: center;
									justify-content: center;
									line-height: 0;
									font-size: 18px;
									background: var(--sc-color-gray-200);
									border-radius: var(
										--sc-border-radius-small
									);
								`}
							>
								{providerData?.name.charAt(0)}
							</div>
						)}
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
							{integrationData?.label}
						</div>
						{providerData?.item_label}
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
