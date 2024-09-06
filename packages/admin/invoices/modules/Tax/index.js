/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import Box from '../../../ui/Box';
import TaxBehavior from './TaxBehavior';
import TaxId from './TaxId';
import { useInvoice } from '../../hooks/useInvoice';

export default () => {
	const { loading } = useInvoice();

	return (
		<Box title={__('Tax', 'surecart')} loading={loading}>
			<div>
				<TaxBehavior />
				<TaxId />
			</div>
		</Box>
	);
};
