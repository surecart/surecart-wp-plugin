import SettingsTemplate from '../SettingsTemplate';
import { __ } from '@wordpress/i18n';
import Suretriggers from './Suretriggers';
export default () => {
	return (
		<SettingsTemplate
			title={__('Integrations', 'surecart')}
			icon={<sc-icon name="credit-card"></sc-icon>}
			noButton
		>
			<Suretriggers />
		</SettingsTemplate>
	);
};
