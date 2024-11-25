import SettingsTemplate from '../SettingsTemplate';
import { __ } from '@wordpress/i18n';
import Suretriggers from './Suretriggers';
export default () => {
	return (
		<SettingsTemplate
			title={__('Integrations', 'surecart')}
			icon={<sc-icon name="zap"></sc-icon>}
			noButton
		>
			<Suretriggers />
		</SettingsTemplate>
	);
};
