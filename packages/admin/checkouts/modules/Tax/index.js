/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import Box from '../../../ui/Box';
import { __ } from '@wordpress/i18n';
import {
	ScButton,
	ScIcon,
	ScDialog,
	ScTaxIdInput,
	ScDropdown,
	ScMenu,
	ScMenuItem,
} from '@surecart/components-react';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { useState, useEffect } from '@wordpress/element';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
import { select, useDispatch } from '@wordpress/data';
import TaxIdDisplay from './TaxIdDisplay';
import expand from '../../query';

export default ({ checkout, loading, busy, setBusy }) => {
	const { receiveEntityRecords } = useDispatch(coreStore);
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

	const onChange = async (tax_identifier) => {
		try {
			setBusy(true);
			// get the line items endpoint.
			const { baseURL } = select(coreStore).getEntityConfig(
				'surecart',
				'draft-checkout'
			);

			const data = await apiFetch({
				method: 'PATCH',
				path: addQueryArgs(`${baseURL}/${checkout?.id}`, { expand }),
				data: {
					tax_identifier,
				},
			});

			// update the checkout in the redux store.
			receiveEntityRecords(
				'surecart',
				'draft-checkout',
				data,
				undefined,
				false,
				checkout
			);

			setOpen(false);
		} catch (e) {
			console.error(e);
			createErrorNotice(
				e?.message || __('Something went wrong', 'surecart'),
				{
					type: 'snackbar',
				}
			);
			(e?.additional_errors || []).map((e) => {
				if (e?.message) {
					createErrorNotice(e.message, {
						type: 'snackbar',
					});
				}
			});
		} finally {
			setBusy(false);
		}
	};

	return (
		<>
			<Box
				title={__('Tax', 'surecart')}
				loading={loading}
				footer={
					!loading &&
					!checkout?.tax_identifier?.id && (
						<ScButton onClick={() => setOpen(true)}>
							{__('Add A Tax ID', 'surecart')}
						</ScButton>
					)
				}
			>
				{!!checkout?.tax_identifier?.id && (
					<div
						css={css`
							display: flex;
							justify-content: space-between;
						`}
					>
						<TaxIdDisplay taxId={checkout?.tax_identifier} />

						<ScDropdown placement="bottom-end">
							<ScButton slot="trigger" type="text" circle>
								<ScIcon name="more-horizontal" />
							</ScButton>
							<ScMenu>
								<ScMenuItem onClick={() => setOpen(true)}>
									{__('Edit', 'surecart')}
								</ScMenuItem>
								<ScMenuItem onClick={() => onChange(null)}>
									{__('Delete', 'surecart')}
								</ScMenuItem>
							</ScMenu>
						</ScDropdown>
					</div>
				)}
			</Box>

			<ScDialog
				label={__('Edit Tax ID', 'surecart')}
				open={open}
				style={{ '--dialog-body-overflow': 'visible' }}
				onScRequestClose={() => setOpen(false)}
			>
				<ScTaxIdInput
					number={taxId?.number}
					type={taxId?.number_type}
					onScInput={(e) => setTaxId(e?.detail)}
				/>

				<ScButton
					type="text"
					onClick={() => setOpen(false)}
					slot="footer"
				>
					{__('Cancel', 'surecart')}
				</ScButton>

				<ScButton
					busy={busy}
					type="primary"
					onClick={() => {
						onChange(taxId);
					}}
					slot="footer"
				>
					{__('Update', 'surecart')}
				</ScButton>
			</ScDialog>
		</>
	);
};
