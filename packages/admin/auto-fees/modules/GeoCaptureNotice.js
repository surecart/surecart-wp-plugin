/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';

/**
 * Internal dependencies.
 */
import { ScAlert, ScButton } from '@surecart/components-react';
import { rulesHaveGeoAddressCountry } from '../utils/helper';

// The order protocol entity that holds the location-capture setting (see OrderProtocol.js).
const ORDER_PROTOCOL = ['surecart', 'store', 'order_protocol'];

/**
 * Warns when a dynamic price uses a Geo Address Country rule while location
 * capture is off — without it the rule never matches. Lets the merchant enable
 * the setting in one click. Self-hides when not applicable.
 *
 * @param {Object} props
 * @param {Object} props.rules Auto-fee rules tree.
 */
export default ({ rules }) => {
	const [error, setError] = useState(null);
	const { editEntityRecord, saveEditedEntityRecord } =
		useDispatch(coreStore);
	const { createSuccessNotice } = useDispatch(noticesStore);

	const { enabled, hasLoaded, isSaving } = useSelect((select) => {
		const protocol = select(coreStore).getEditedEntityRecord(
			...ORDER_PROTOCOL
		);
		return {
			enabled: !!protocol?.capture_geo_address_enabled,
			hasLoaded: select(coreStore).hasFinishedResolution(
				'getEditedEntityRecord',
				ORDER_PROTOCOL
			),
			isSaving: select(coreStore).isSavingEntityRecord(...ORDER_PROTOCOL),
		};
	}, []);

	// Nothing to warn about until we know the setting is loaded, off, and a geo rule exists.
	if (!hasLoaded || enabled || !rulesHaveGeoAddressCountry(rules)) {
		return null;
	}

	const enableCapture = async () => {
		setError(null);
		try {
			editEntityRecord('surecart', 'store', 'order_protocol', {
				capture_geo_address_enabled: true,
			});
			await saveEditedEntityRecord(...ORDER_PROTOCOL, {
				throwOnError: true,
			});
			createSuccessNotice(
				__('Location capture enabled at checkout.', 'surecart'),
				{ type: 'snackbar' }
			);
		} catch (e) {
			console.error(e);
			setError(
				e?.message ||
					__('Could not enable location capture.', 'surecart')
			);
		}
	};

	return (
		<ScAlert type="warning" open style={{ marginBottom: '1em' }}>
			<span slot="title">
				{__('Location capture is off', 'surecart')}
			</span>
			{__(
				"This dynamic price uses a geo-address country condition, but the customer's location isn't being captured at checkout — so the condition will never match. Turn on location capture to use it.",
				'surecart'
			)}
			{!!error && <div style={{ marginTop: '0.5em' }}>{error}</div>}
			<div style={{ marginTop: '0.75em' }}>
				<ScButton
					type="warning"
					size="small"
					loading={isSaving}
					onClick={enableCapture}
				>
					{__('Turn on location capture', 'surecart')}
				</ScButton>
			</div>
		</ScAlert>
	);
};
