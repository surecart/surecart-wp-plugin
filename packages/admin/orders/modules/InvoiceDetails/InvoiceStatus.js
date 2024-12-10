/**
 * External dependencies.
 */
import { PanelRow } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { ScInvoiceStatusBadge } from '@surecart/components-react';

export default ({ status }) => {
	return (
		<PanelRow>
			<div>{__('Status', 'surecart')}</div>
			<div>
				<ScInvoiceStatusBadge status={status} />
			</div>
		</PanelRow>
	);
};
