import { __ } from '@wordpress/i18n';
import useAccount from '../../mixins/useAccount';

export default ({ title, model }) => {
	const { id } = useAccount();

	return (
		<sc-stacked-list-row style={{ '--columns': '2' }}>
			<strong style={{ padding: '10px 0px' }}>{title}</strong>
			<sc-button
				size="small"
				slot="suffix"
				href={
					scData?.claim_url
						? scData?.claim_url
						: `${scData?.app_url}/exports?switch_account_id=${id}`
				}
				target={scData?.claim_url ? '_self' : '_blank'}
			>
				<sc-icon name="download" slot="suffix"></sc-icon>
				{__('Export CSV', 'surecart')}
			</sc-button>
		</sc-stacked-list-row>
	);
};
