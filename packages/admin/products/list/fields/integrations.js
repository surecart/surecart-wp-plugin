/** @jsx jsx */
import { __ } from '@wordpress/i18n';
import { css, jsx } from '@emotion/react';
import { ScTag, ScTooltip } from '@surecart/components-react';

export default ({ integrationsByProduct = {}, providers = {}, itemLabels = {} } = {}) => ({
	id: 'integrations',
	label: __('Integrations', 'surecart'),
	enableSorting: false,
	render: ({ item }) => {
		const itemIntegrations = integrationsByProduct[item?.id] || [];
		if (!itemIntegrations.length) return '-';
		return (
			<div
				css={css`
					display: flex;
					flex-wrap: wrap;
					gap: 4px;
				`}
			>
				{itemIntegrations.map((integration) => {
					const provider = providers[integration.provider];
					const label =
						itemLabels[integration.integration_id] ||
						provider?.label ||
						integration.provider;
					return provider?.logo ? (
						<ScTooltip
							key={integration.id}
							text={label}
							css={css`
								display: inline-flex;
							`}
						>
							<img
								src={provider.logo}
								alt={label}
								css={css`
									width: 20px;
									height: 20px;
									flex: 0 0 20px;
									cursor: help;
								`}
							/>
						</ScTooltip>
					) : (
						<ScTag key={integration.id} type="info">
							{label}
						</ScTag>
					);
				})}
			</div>
		);
	},
});
