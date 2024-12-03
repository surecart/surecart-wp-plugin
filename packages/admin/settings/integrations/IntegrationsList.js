/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import SettingsTemplate from '../SettingsTemplate';
import { __ } from '@wordpress/i18n';
import Suretriggers from './Suretriggers';
import IntegrationCard from './IntegrationCard';
import { useEntityRecords } from '@wordpress/core-data';
export default () => {
	const { records } = useEntityRecords('surecart', 'integration_catalog');

	return (
		<SettingsTemplate
			title={__('Integrations', 'surecart')}
			icon={<sc-icon name="zap"></sc-icon>}
			noButton
		>
			<div
				css={css`
					display: grid;
					gap: 1em;
					grid-template-columns: repeat(
						auto-fill,
						minmax(200px, 1fr)
					);
					grid-auto-rows: 1fr; /* Makes all rows equal height */
				`}
			>
				{(records || []).map((record) => (
					<IntegrationCard key={record.id} integration={record} />
				))}
			</div>
			<Suretriggers />
		</SettingsTemplate>
	);
};
