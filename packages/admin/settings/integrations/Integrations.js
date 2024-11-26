/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import SettingsTemplate from '../SettingsTemplate';
import { __ } from '@wordpress/i18n';
import Suretriggers from './Suretriggers';
import Provider from './Provider';
import { useEntityRecords } from '@wordpress/core-data';
export default () => {
	const { records } = useEntityRecords('surecart', 'integration_provider', {
		context: 'edit',
	});

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
				`}
			>
				{(records || []).map((record) => (
					<Provider key={record.id} provider={record} />
				))}
			</div>
			<Suretriggers />
		</SettingsTemplate>
	);
};
