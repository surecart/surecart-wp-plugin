/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { ScPhoneInput } from '@surecart/components-react';
import { useInvoice } from '../hooks/useInvoice';

/**
 * Phone number input component for draft invoices.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.checkout - The checkout object.
 * @return {JSX.Element} The phone input component.
 */
export default ({ checkout }) => {
	const [phone, setPhone] = useState(checkout?.phone || '');
	const { isDraftInvoice, updateCheckout } = useInvoice();

	// Sync phone state when checkout changes.
	useEffect(() => {
		setPhone(checkout?.phone || '');
	}, [checkout?.phone]);

	const savePhone = async (phoneValue) => {
		if (!isDraftInvoice || !checkout?.id) return;

		await updateCheckout({
			phone: phoneValue,
		});
	};

	return (
		<ScPhoneInput
			label={__('Phone', 'surecart')}
			value={phone}
			onScChange={(e) => {
				setPhone(e.target.value);
				savePhone(e.target.value);
			}}
			required
			css={css`
				margin-top: var(--sc-spacing-large);
			`}
		/>
	);
};
