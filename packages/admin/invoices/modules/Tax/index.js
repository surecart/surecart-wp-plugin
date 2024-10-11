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
import TaxEnabled from './TaxEnabled';
import { useEffect, useState } from '@wordpress/element';
import { useInvoice } from '../../hooks/useInvoice';

export default () => {
	const { loading, checkout, isDraftInvoice, updateCheckout } = useInvoice();

	const [taxEnabled, setTaxEnabled] = useState(checkout?.tax_enabled);

	useEffect(() => {
		setTaxEnabled(checkout?.tax_enabled);
	}, [checkout?.tax_enabled]);

	const onChange = async (value) => {
		setTaxEnabled(value);
		await updateCheckout({
			tax_enabled: value,
		});
	};

	return (
		<Box title={__('Tax', 'surecart')} loading={loading}>
			<div>
				<TaxEnabled
					value={taxEnabled}
					onChange={onChange}
					locked={!isDraftInvoice}
				/>
				{taxEnabled && <TaxBehavior />}
				<TaxId />
			</div>
		</Box>
	);
};
