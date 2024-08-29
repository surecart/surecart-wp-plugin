/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import { useState, useEffect } from '@wordpress/element';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
import { select, useDispatch } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies.
 */
import Box from '../../../ui/Box';
import expand from '../../checkout-query';
import TaxBehavior from './TaxBehavior';
import TaxId from './TaxId';

export default ({
	invoice,
	checkout,
	loading,
	busy,
	setBusy,
	onUpdateInvoiceEntityRecord,
}) => {
	const [open, setOpen] = useState(false);
	const { createErrorNotice } = useDispatch(noticesStore);
	const [taxId, setTaxId] = useState(checkout?.tax_identifier);

	// local state when shipping address changes.
	useEffect(() => {
		setTaxId({
			number: checkout?.tax_identifier?.number,
			number_type: checkout?.tax_identifier?.number_type,
		});
	}, [checkout?.tax_identifier]);

	const onChange = async ({ tax_identifier, tax_behavior }) => {
		try {
			setBusy(true);

			const { baseURL } = select(coreStore).getEntityConfig(
				'surecart',
				'draft-checkout'
			);

			const requestData = {
				...(tax_identifier !== undefined && { tax_identifier }),
				...(tax_behavior !== undefined && { tax_behavior }),
			};

			const data = await apiFetch({
				method: 'PATCH',
				path: addQueryArgs(`${baseURL}/${checkout?.id}`, { expand }),
				data: requestData,
			});

			onUpdateInvoiceEntityRecord({
				...invoice,
				checkout: data,
			});

			setOpen(false);
		} catch (e) {
			console.error(e);
			createErrorNotice(e);
		} finally {
			setBusy(false);
		}
	};

	return (
		<Box title={__('Tax', 'surecart')} loading={loading}>
			<div>
				<TaxBehavior
					invoice={invoice}
					onChange={onChange}
					busy={busy}
				/>
				<TaxId invoice={invoice} onChange={onChange} busy={busy} />
			</div>
		</Box>
	);
};
