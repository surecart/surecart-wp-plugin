/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
  ScBadgeNotice,
	ScButton,
	ScDropdown,
	ScIcon,
	ScMenu,
	ScMenuItem,
  ScSkeleton,
  ScStackedListRow,
  ScTag,
} from '@surecart/components-react';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch, useSelect } from '@wordpress/data';
import { __, sprintf } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';

import useEntity from '../../../hooks/useEntity';

export default ({ id }) => {
	const { createSuccessNotice } = useDispatch(noticesStore);
	const { integration, deleteIntegration, deletingIntegration } = useEntity(
		'integration',
		id
	);
	const { integration_id, provider } = integration;

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

	const { integrationData, integrationDataResolved } = useSelect(
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
				integrationDataResolved: select(
					coreStore
				).hasFinishedResolution('getEntityRecord', queryArgs),
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
			await deleteIntegration({ throwOnError: true });
			createSuccessNotice(__('Integration deleted.', 'surecart'), {
				type: 'snackbar',
			});
		} catch (e) {
			console.error(e);
			setError(e?.message || __('An error occurred', 'surecart'));
		}
	};

	if (integration_id && integrationDataResolved && !integrationData?.label) {
		return (
			<ScStackedListRow style={{ position: 'relative' }} mobile-size={0}>
				<div
					css={css`
						overflow: hidden;
            align-items: center;
						text-overflow: ellipsis;
						white-space: nowrap;
            display: flex;
            gap: 1em;
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
							{sprintf( __('%s not found', 'surecart'), providerData?.label)}
						</div>
						{sprintf(
						__(
							'The provider is not installed or unavailable.',
							'surecart'
						)
					)}
					</div>

          <ScTag type='warning'>{__('Disabled', 'surecart')}</ScTag>
				</div>

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
			</ScStackedListRow>
		);
	}

	return (
		<ScStackedListRow style={{ position: 'relative' }} mobile-size={0}>
			{loading || deletingIntegration ? (
				<div
					css={css`
						display: grid;
						gap: 1em;
					`}
				>
					<ScSkeleton
						style={{ width: '60px', display: 'inline-block' }}
					></ScSkeleton>
					<ScSkeleton
						style={{ width: '80px', display: 'inline-block' }}
						slot="price"
					></ScSkeleton>
				</div>
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
								{(providerData?.name || 'I' ).charAt(0)}
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
		</ScStackedListRow>
	);
};
