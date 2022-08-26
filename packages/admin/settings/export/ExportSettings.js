import SettingsTemplate from '../SettingsTemplate';
import ExportRow from './ExportRow';
import { __ } from '@wordpress/i18n';

export default () => {
	return (
		<SettingsTemplate
			title={__('Data Export', 'surecart')}
			icon={<sc-icon name="layers"></sc-icon>}
			noButton
		>
			<sc-card no-padding>
				<sc-stacked-list>
					<ExportRow
						title={__('Charges', 'surecart')}
						model="charges"
					/>
					<ExportRow
						title={__('Coupons', 'surecart')}
						model="coupons"
					/>
					<ExportRow
						title={__('Customers', 'surecart')}
						model="customers"
					/>
					<ExportRow
						title={__('Orders', 'surecart')}
						model="orders"
					/>
					<ExportRow
						title={__('Products/Prices', 'surecart')}
						model="prices"
					/>
					<ExportRow
						title={__('Promotions', 'surecart')}
						model="promotions"
					/>
					<ExportRow
						title={__('Refunds', 'surecart')}
						model="refunds"
					/>
					<ExportRow
						title={__('Subscriptions', 'surecart')}
						model="subscriptions"
					/>
				</sc-stacked-list>
			</sc-card>
		</SettingsTemplate>
	);
};
