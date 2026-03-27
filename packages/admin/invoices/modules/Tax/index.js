/** @jsx jsx */
/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { css, jsx } from '@emotion/react';

/**
 * Internal dependencies.
 */
import Box from '../../../ui/Box';
import TaxBehavior from './TaxBehavior';
import TaxId from './TaxId';
import TaxEnabled from './TaxEnabled';
import { useEffect, useRef, useState } from '@wordpress/element';
import { useInvoice } from '../../hooks/useInvoice';
import { ScButton, ScIcon } from '@surecart/components-react';
import { addQueryArgs } from '@wordpress/url';

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
		<Box
			title={__('Tax', 'surecart')}
			loading={loading}
			header_action={
				<>
					<ScButton
						href={addQueryArgs('admin.php', {
							page: 'sc-settings',
							tab: 'tax_protocol',
						})}
						type="link"
						target="_blank"
						css={css`
							margin: -12px 0;
						`}
					>
						{__('Settings', 'surecart')}
						<ScIcon name="external-link" slot="suffix" />
					</ScButton>
				</>
			}
		>
			<div>
				<TaxEnabled
					value={taxEnabled}
					onChange={onChange}
					locked={!isDraftInvoice}
				/>
				<TaxBehavior />
				<TaxId />
			</div>
		</Box>
	);
};
