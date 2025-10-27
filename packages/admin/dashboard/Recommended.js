/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import Box from '../ui/Box';
import { __ } from '@wordpress/i18n';
import { useEntityRecords } from '@wordpress/core-data';
import ActivationButton from './components/ActivationButton';
import { ScButton, ScIcon } from '@surecart/components-react';

export default () => {
	const { records } = useEntityRecords('surecart', 'integration_catalog', {
		per_page: 100,
	});

	// Get all recommended plugins.
	const recommendedPlugins = (records || [])
		.filter((record) => {
			return (
				(record._embedded['wp:term'][0] || []).some(
					(record) => record.slug === 'recommended'
				) &&
				!!record?.slug &&
				!record?.theme_slug
			);
		})
		.slice(0, 4);

	return (
		<Box
			title={__('Featured Integrations', 'surecart')}
			header_action={
				<ScButton
					css={css`
						margin: -10px 0;
					`}
					type="text"
					aria-label={__('View all integrations', 'surecart')}
					href="admin.php?page=sc-settings&tab=integrations"
				>
					{__('View all', 'surecart')}
					<ScIcon name="arrow-right" slot="suffix"></ScIcon>
				</ScButton>
			}
			isBorderLess={false}
			hasDivider={false}
		>
			<div
				css={css`
					display: grid;
					grid-template-columns: repeat(4, 1fr);
					justify-content: space-between;
					align-items: stretch;
					gap: var(--sc-spacing-large);

					@media (max-width: 1024px) {
						grid-template-columns: repeat(2, 1fr);
					}

					@media (max-width: 768px) {
						grid-template-columns: repeat(1, 1fr);
					}
				`}
			>
				{recommendedPlugins.map((plugin) => (
					<div
						css={css`
							display: flex;
							flex-direction: column;
							gap: var(--sc-spacing-small);
							padding: var(
								--sc-card-padding,
								var(--sc-spacing-large)
							);
							background: var(
								--sc-card-background-color,
								var(--sc-color-white)
							);
							border: 1px solid
								var(
									--sc-card-border-color,
									var(--sc-color-gray-300)
								);
							border-radius: var(
								--sc-card-border-radius,
								var(--sc-input-border-radius-medium)
							);
							box-shadow: var(--sc-shadow-small);
						`}
					>
						<img
							src={plugin.logo_url}
							alt={plugin.title?.rendered}
							css={css`
								width: 20px;
								height: 20px;
								flex: 0 0 20px;
							`}
						/>
						<div>
							<h3
								css={css`
									font-size: 16px;
									margin: 0;
								`}
							>
								{plugin.title?.rendered}
							</h3>
						</div>
						<div
							css={css`
								font-size: var(--sc-font-size-small);
								margin: 0;
								color: var(--sc-input-help-text-color);
							`}
						>
							{plugin.summary}
						</div>
						<div
							css={css`
								margin-top: auto;
							`}
						>
							<ActivationButton record={plugin} />
						</div>
					</div>
				))}
			</div>
		</Box>
	);
};
