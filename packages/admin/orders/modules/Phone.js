import Box from '../../ui/Box';
import { __ } from '@wordpress/i18n';

export default ({ phone, label, loading }) => {
	return (
		<Box title={label || __('Phone', 'surecart')} loading={loading}>
			<span slot="description">{phone}</span>
		</Box>
	);
};
